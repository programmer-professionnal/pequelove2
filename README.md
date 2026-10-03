# Para ti — Un buzón de amor

Una página de cartas y poemas, hecha con HTML, CSS y JavaScript. No necesita instalación, cuentas, base de datos ni compilación.

El buzón incluye **130 cartas largas y sentimentales**, cada una con su propio poema, editables en `cartas.js`. Incluye cartas para cuando sientas que me estoy volviendo a alejar, para recordar cuánto te deseo y para recordar nuestro comienzo. La carta de cierre está en el sobre 130.

Además, **«Un año de quererte» contiene 365 cartas diarias originales e independientes** en `cartas-diarias.js`. El recorrido empieza el **1 de agosto**, el día que nos conocimos, y termina el **31 de julio**. La carta del **2 de agosto** recuerda nuestra cita, el agua de pepino que no nos gustó a ninguno y la mermelada de mango. Hay una carta adicional para el 29 de febrero en años bisiestos.

La mayoría de las cartas diarias son breves. Las **16 cartas del 28 de agosto al 12 de septiembre** son más largas y personales: recuerdan el alejamiento del 28 de agosto, el reconocimiento de no haber priorizado lo importante, la organización del tiempo y el valor de volver a escribir para retomar nuestra historia. El regreso se recuerda **cerca del 10 de septiembre**, sin fijar un día exacto. Estas cartas miran ese período desde el presente; cada casilla no afirma que todos los pensamientos o acciones narrados ocurrieran ese mismo día.

## Abrir el buzón

Abre `index.html` con un navegador moderno (Chrome, Edge, Firefox o Safari). Puedes hacer doble clic en el archivo: las cartas también funcionan sin un servidor.

Si prefieres usar un servidor local, desde esta carpeta ejecuta:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Después visita `http://127.0.0.1:8000`. Detén el servidor con `Ctrl+C`.

Las tipografías se descargan de Google Fonts cuando hay conexión. Sin conexión se usan las alternativas del sistema y todo el buzón sigue funcionando. No se guardan datos ni se usan cookies o analítica.

## Añadir una carta

1. Abre `cartas.js` en tu editor.
2. Copia la plantilla comentada del principio y pégala **dentro de `window.CARTAS = [...]`**, antes del `];` final.
3. Cambia `id`, `titulo`, `mensaje` y, si quieres, `poema`. Cada `id` debe ser único; por ejemplo, `"cuando-quieras-celebrar"`.
4. Guarda y actualiza el navegador. El nuevo sobre aparece automáticamente.

Ejemplo de entrada:

```js
{
  id: "cuando-quieras-celebrar",
  titulo: "Cuando quieras celebrar",
  mensaje: `Mi amor,

Hoy quiero celebrar contigo, incluso si el motivo parece pequeño.

Qué bonito poder alegrarnos juntos.`,
  poema: `Un motivo pequeñito,
una alegría que compartir.
Te dejo un beso por escrito
y muchas ganas de verte reír.`,
},
```

- **Editar:** cambia el título o los textos de una entrada.
- **Reordenar:** mueve la entrada completa dentro de la lista. La numeración se ajusta sola.
- **Eliminar:** borra la entrada completa, desde `{` hasta `},`.
- **Sin poema:** elimina el campo `poema` o déjalo como `poema: ""`. El espacio del poema desaparece.
- **Párrafos y versos:** deja una línea vacía entre párrafos y un salto de línea entre versos. No uses etiquetas HTML: se muestran literalmente.
- **Signos especiales:** dentro de los textos delimitados por comillas invertidas, escribe `\`` para incluir una comilla invertida, `\${` para escribir literalmente `${` y `\\` para una barra invertida. Las comillas normales, los acentos y los emojis funcionan sin cambios.
- **Errores:** si una carta no aparece, revisa que tenga un `id` único, un `titulo` y un `mensaje` no vacíos. Las entradas inválidas se omiten y se avisa en la consola del navegador. Un error de sintaxis (como olvidar una coma o una comilla) puede impedir cargar la lista completa.

## El calendario de agosto a julio

Al abrir la página aparece el **1 de agosto**. Puedes elegir cualquier fecha, avanzar de mes o usar «Ir a hoy». El botón «1 de agosto» vuelve al comienzo. Las flechas del teclado permiten recorrer los días una vez que un día tiene el foco; Enter o Espacio seleccionan los botones y abren la carta con «Abrir la carta». Todas las fechas se pueden leer libremente.

El calendario muestra el ciclo anual que contiene la fecha local del dispositivo: desde el último 1 de agosto hasta el siguiente 31 de julio. Por ejemplo, en septiembre de 2026 muestra agosto de 2026 a julio de 2027. Los años mostrados organizan el calendario; no indican el año en que nos conocimos. Las cartas se repiten por mes y día cada año. «Ir a hoy» se actualiza al cambiar de día o al volver a la pestaña. En un ciclo bisiesto se incluye el 29 de febrero sin desplazar las demás fechas.

Para personalizar una carta diaria, busca su `fecha` en `cartas-diarias.js` y cambia `titulo` y `mensaje`. Las entradas están ordenadas de agosto a julio y usan el formato **mes-día**, por ejemplo:

```js
{ fecha: "08-02", titulo: "Nuestra primera cita", mensaje: `Mi amor,

Aquí puedes escribir tu recuerdo y dejar todos los párrafos que quieras.` },
```

Cada fecha debe aparecer una sola vez. Puedes añadir el campo opcional `poema` igual que en el buzón; cuando no existe, su espacio se oculta. No necesitas HTML. Si eliminas una fecha, el calendario indica que su sobre está por escribir y desactiva el botón de apertura. La carta adicional bisiesta está al final del archivo, en `window.CARTA_BISIESTA`; si la quitas, el 29 de febrero comparte la carta del 28. Reordenar las entradas no cambia la fecha asignada a cada texto.

## Cambiar la apariencia

Edita las variables del bloque `:root` al inicio de `styles.css` para cambiar los colores del papel y los sobres, las tipografías, el ancho de la página o el tamaño del texto. Los cuatro colores de sobres se repiten automáticamente en cualquier cantidad de cartas.

La bienvenida, la nota final y el pie de página están en `index.html`. La apertura de cartas y la generación de sobres están en `app.js`; el calendario está en `diario.js`. No hace falta modificar estos scripts para gestionar el contenido.

## Comprobación manual

- Abre y cierra todas las cartas mediante el botón de cierre, «Volver al buzón», la tecla Escape y un clic fuera de la carta.
- Usa Tab para recorrer los controles y Enter o Espacio para abrir un sobre. El foco debe permanecer en la carta abierta y regresar al sobre al cerrarla.
- Revisa el buzón en celular y computadora: textos completos, desplazamiento vertical de cartas largas y ausencia de desbordamiento horizontal.
- Comprueba que aparezcan los 130 sobres. Añade temporalmente una carta, reordena algunas, prueba una sin poema y otra con un mensaje largo; al recargar, comprueba el resultado. Después restaura tu colección.
- Recorre los meses de agosto a julio y abre las cartas del 1 y 2 de agosto. Comprueba «Ir a hoy», el retorno al inicio, el cambio de año en enero y el 29 de febrero en un ciclo bisiesto. Al cerrar una carta diaria, el foco debe regresar a «Abrir la carta».
- Activa «reducir movimiento» en el sistema: las animaciones deben desaparecer.

## Publicación en GitHub Pages

- Sitio público: https://programmer-professionnal.github.io/pequelove2/
- Repositorio: https://github.com/programmer-professionnal/pequelove2

GitHub Pages sirve la raíz de la rama `main`. El archivo `.nojekyll` permite publicar directamente los archivos estáticos. No requiere compilación ni servidor de datos.

Para actualizar las cartas, edita los archivos, guarda los cambios y súbelos al repositorio:

```sh
git add cartas.js cartas-diarias.js
git commit -m "Actualizar cartas"
git push
```

La web se actualiza después de que termine el despliegue de GitHub Pages. Puedes comprobarlo en la pestaña **Actions** del repositorio y consultar el enlace en **Settings → Pages**.
