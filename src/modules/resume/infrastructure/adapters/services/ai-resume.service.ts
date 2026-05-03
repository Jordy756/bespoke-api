import { AiOrchestratorService } from '@core/providers/ai-orchestrator.service';
import { GeneratedResumeResult, IAiResumeService } from '@modules/resume/domain/ports/ai-resume.service.port';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiResumeService implements IAiResumeService {
  private readonly logger = new Logger(AiResumeService.name);

  constructor(private readonly ai: AiOrchestratorService) {}

  private readonly SYSTEM_PROMPT = `Eres un experto escribiendo CVs optimizados para ATS (Applicant Tracking Systems) y reclutadores.

## REGLAS OBLIGATORIAS:

### Formato de Salida
- Output EXCLUSIVAMENTE JSON válido. Sin Markdown, sin texto extra.
- La respuesta debe ser un objeto JSON con la estructura definida.

### Estructura del CV Generado
El CV debe contener estas secciones obligatorias:
{
  "basics": { "name", "email", "phone", "location", "summary" },
  "experience": [{ "company", "position", "startDate", "endDate", "highlights" }],
  "education": [{ "institution", "area", "startDate", "endDate" }],
  "skills": { "technical": [], "soft": [], "languages": [] },
  "projects": [{ "name", "description", "technologies", "outcome" }],
  "certificates": [{ "name", "date", "issuer" }]
}

### Best Practices para CV profesional:

1. **SUMMARY (basics.summary)**:
   - Máximo 2-3 líneas (50-70 palabras)
   - Incluir años de experiencia total: "X+ años de experiencia en..."
   - Incluir stack principal: tecnologias mas usadas
   - Valor agregado clave: "especializado en...", "enfocado en..."

2. **EXPERIENCE (experience.highlights)**:
   - Maximum 4 highlights por cada puesto
   - Cada highlight debe ser CUANTIFICABLE donde sea posible:
     - "Incrementé ventas en 40%"
     - "Reduje tiempos de procesamiento en 80%"
     - "Gestioné un equipo de 5 personas"
     - "Lancé 3 productos al mercado"
   - Formato: Verbo en pasado + resultado medible + contexto
   - Keywords de la oferta SIEMPRE incluidos

3. **PROJECTS (projects)**:
   - Maximum 3 proyectos destacados (los mas relevantes para la oferta)
   - Incluir outcome cuantificable si existe: "Usado por 1000+ usuarios", "Mejora eficiencia 50%"
   - Tecnologías Clave como keywords

4. **SKILLS (skills)**:
   - технические: Solo las relevantes para la oferta (max 10-12)
   - soft: Max 3-4 competencias
   - languages: Idiomas con nivel (ej: "Español nativo", "Inglés B2")

5. **EDUCATION**:
   - Solo título + institución + fecha
   - Sin logrosni "achievements" aqui (ya están en proyectos/académicos si aplica)

6. **CERTIFICATES**:
   - Solo los relevantes para la oferta (max 5)
   - Fecha reciente primero

### ATS Optimization:
- Keywords exactos de la oferta DEBEN estar en el CV
- NO usar tablas, no usar imágenes, no usar símbolos raros
- Nombres de tecnologias completos: "React.js" no "React"
- Fechas en formato estándar: "2023-2024" o "Ene 2023 - Dic 2024"

### Output Requirements:
- Solo JSON válido. Sin Markdown.
- ElfitScore debe ser 0-100 basado en:
  - Coincidencia de keywords (40%)
  - Experiencia relevante (30%)
  - Cuantificación de logros (20%)
  - Formato limpio (10%)`;

  private buildUserPrompt(profileData: string, jobOffer: string): string {
    return `[JOB OFFER - Analyze carefully and extract keywords]
${jobOffer}

[CANDIDATE PROFILE DATA]
${profileData}

[INSTRUCTIONS]
1. Lee la oferta y extrae los keywords mas importantes (tecnologías, metodologías, skills)
2. Analiza el perfil del candidato
3. Selecciona la experiencia y proyectos MAS relevantes para ESTA oferta específica
4. Adapta el summary para enfatizar lo que la oferta busca
5. Cuantifica logros donde sea posible
6. Genera el JSON final optimizado para ESTA oferta

OUTPUT: JSON válido con la estructura definida en el system prompt.`;
  }

  // ─────────────────────────────────────────────────────────
  // Main Generation
  // ─────────────────────────────────────────────────────────

  async generateResume(profileDataJson: string, jobOffer: string): Promise<GeneratedResumeResult> {
    this.logger.log('Generating ATS-optimized tailored resume...');

    const userPrompt = this.buildUserPrompt(profileDataJson, jobOffer);

    try {
      const rawResponse = await this.ai.generate({
        system: this.SYSTEM_PROMPT,
        prompt: userPrompt,
      });

      console.log('Raw AI response:', rawResponse);

      // Parse y valida que sea JSON válido
      const parsed = JSON.parse(rawResponse) as {
        professionalTitle?: string;
        basics?: { summary?: string };
        experience?: Array<{ highlights?: string[] }>;
        fitScore?: number;
      };

      // Extrae datos para el retorno
      const jobTitle = parsed.professionalTitle || 'Professional Title';
      const fitScore = parsed.fitScore ?? this.calculateFitScore(parsed, jobOffer);

      this.logger.log(`Generated resume with fitScore: ${fitScore}`);

      return {
        jobTitle,
        fitScore,
        data: rawResponse,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Resume generation failed: ${msg}`);
      throw new Error('Failed to generate tailored resume');
    }
  }

  // ─────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────

  private calculateFitScore(parsed: any, jobOffer: string): number {
    // Scoring básico basado en keywords de la oferta
    const offerLower = jobOffer.toLowerCase();
    let score = 70; // Base

    if (parsed.experience?.length > 0) score += 10;
    if (parsed.skills?.technical?.length > 0) score += 10;
    if (parsed.projects?.length > 0) score += 10;

    return Math.min(score, 100);
  }
}
