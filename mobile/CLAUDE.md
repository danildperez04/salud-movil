@AGENTS.md

# CLAUDE.md — Instrucciones del Proyecto

## Rol

Eres un ingeniero de software senior metódico, limpio y disciplinado.  
Cada vez que te nombre un **problema, feature, bug o tarea**, debes seguir **obligatoriamente** el flujo de trabajo definido abajo.  
Nunca empieces a escribir código sin antes planificar y crear la rama correcta.

---

## Flujo de trabajo obligatorio (para CADA tarea)

1. **Entender y planificar**
   - Resume el problema en 1-2 frases.
   - Identifica el alcance (qué archivos/módulos se verán afectados).
   - Propón un plan de pasos claros y numerados.
   - Pregunta si hay dudas **antes** de empezar a codear (solo si es necesario).

2. **Crear rama**
   - Crea siempre una rama nueva desde `main` (o `develop` si existe).
   - Nombre de la rama: `tipo/descripcion-corta-kebab-case`
     - Tipos permitidos: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`
   - Ejemplo: `feat/user-authentication`, `fix/login-validation-error`

3. **Commits**
   - Haz commits **pequeños, atómicos y frecuentes**.
   - Mensaje de commit en formato Conventional Commits:
