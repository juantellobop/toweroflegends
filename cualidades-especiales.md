# Torre de Leyendas — Cualidades especiales (rasgos)

Cada jugador puede tener como máximo un rasgo (`trait`, opcional). Son efectos
pasivos. La lógica está en `engine/traits.js`; aquí se documenta dónde se aplica
cada efecto. Los bonus de stats suman sin tope (pueden superar 99).

| Rasgo | Tipo | Efecto |
|-------|------|--------|
| **Francotirador** | Ataque | +4 tiro · ×1.35 al peso para ser el rematador |
| **Cañón** | Ataque | +3 tiro, +2 físico · ×1.2 al peso de rematador |
| **Muro** | Defensa / Portero | Campo: +5 defensa · Portero: +3 al rating |
| **Motor** | Medio | +4 físico, +3 pase |
| **Maestro** | Medio | +4 pase, +4 regate |
| **Líbero** | Defensa | +4 pase, +2 defensa |
| **Paradón** | Portero | +4 al rating del portero |
| **Mariscal** | Portero | +1 al rating del portero · +1.5 al rating de la línea defensiva |
| **Killer** | Ataque | +5 en el duelo de remate cuando el equipo empata o pierde |
| **Velocista** | Ataque | +5 en el duelo de remate en contraataques |
| **Especialista** | Ataque | ×1.6 al peso de rematador y +4 en duelo a balón parado (córner / falta) |
| **Penalero** | Ataque | ×2.5 al peso de rematador en penaltis · +5% de conversión del penalti |
| **Capitán** | Cualquiera | +1 a la química de su línea |
| **Garra** | Defensa | +4 en el duelo defensivo a partir del minuto 75 |

## Detalle por mecánica

### Bonus de stats de campo (antes de calcular líneas)
`applyTraitToStats()` — aplicado en `engine/teamRatings.js`. Suma directa a las
stats del jugador:
- Francotirador: tiro +4
- Cañón: tiro +3, físico +2
- Muro: defensa +5
- Motor: físico +4, pase +3
- Maestro: pase +4, regate +4
- Líbero: pase +4, defensa +2

### Rating del portero
`gkTraitBonus()` — aplicado en `engine/teamRatings.js`:
- Paradón +4, Muro +3, Mariscal +1.

### Línea defensiva (portero que ordena la zaga)
`gkDefenseLineBonus()` — aplicado en `engine/teamRatings.js`:
- Mariscal: +1.5 al rating de la línea defensiva.

### Selección del rematador (quién remata)
`shooterWeightMultiplier()` — peso base de remate (`engine/teamRatings.js`):
- Francotirador ×1.35, Cañón ×1.2.

`phaseShooterMultiplier()` — peso según la fase de la jugada (`engine/highlights.js`):
- Penalero ×2.5 en penaltis.
- Especialista ×1.6 en córner / falta.

### Duelo atacante vs. defensor
`duelBonus()` — bonus de puntos en el duelo concreto (`engine/highlights.js`):
- Killer (atacante): +5 si el equipo va empatado o perdiendo.
- Velocista (atacante): +5 en contraataques.
- Especialista (atacante): +4 a balón parado (córner / falta).
- Garra (defensor): +4 a partir del minuto 75.

### Penaltis
`penaltyConvertBonus()` — `engine/highlights.js`:
- Penalero: +5% de probabilidad de convertir el penalti.

### Química
`engine/chemistry.js`:
- Capitán: +1 a la química de su línea cuando está alineado.

## Notas
- El rasgo se guarda en la propiedad `trait` (string) del objeto jugador.
- Traducciones por idioma (ES/EN/FR/PT/IT) en `data/i18n.js`, clave `card.trait`.
