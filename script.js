let map, overlay;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    streetViewControl: false,
    mapTypeId: "satellite",
  });

  overlay = new WebGLOverlay(map);
}

class WebGLOverlay extends google.maps.OverlayView {
  constructor(map) {
    super();
    this.map = map;
    this.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(85, 180)
    );
    this.canvas = null;

    this.setMap(map);
  }

  onAdd() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    this.canvas = canvas;

    const panes = this.getPanes();
    panes.overlayLayer.appendChild(canvas);

    const context = canvas.getContext("webgl");
    const vertexShaderSource = `
      void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 10.0;
      }
    `;
    const fragmentShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    const vertexShader = context.createShader(context.VERTEX_SHADER);
    context.shaderSource(vertexShader, vertexShaderSource);
    context.compileShader(vertexShader);

    const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
    context.shaderSource(fragmentShader, fragmentShaderSource);
    context.compileShader(fragmentShader);

    const program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    context.useProgram(program);

    context.viewport(0, 0, canvas.width, canvas.height);
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    context.drawArrays(context.POINTS, 0, 1);
  }

  draw() {
    if (!this.canvas) return;

    const projection = this.getProjection();
    const sw = projection.fromLatLngToDivPixel(this.bounds.getSouthWest());
    const ne = projection.fromLatLngToDivPixel(this.bounds.getNorthEast());

    const canvas = this.canvas;
    canvas.style.width = ne.x - sw.x + "px";
    canvas.style.height = sw.y - ne.y + "px";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  onRemove() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}
