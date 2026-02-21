Este archivo es para los comandos de git que se me olvidan xd
# 1. Ver en qué rama estás
git branch

# 2. Cambiar a la rama
git checkout nombre-de-la-rama

# 3. Agregar los archivos modificados
git add .

# 4. Hacer commit de los cambios
git commit -m "Descripción de los cambios"

# 5. Hacer push a la rama
git push origin nombre-de-la-rama

# Para manipular Prisma
- Hacer migraciones
npx prisma migrate dev --name init
