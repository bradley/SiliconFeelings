THREE.ColorTripShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"#ifdef GL_ES",
		"precision mediump float;",
		"#endif",

		"uniform float time;",
		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main (void) {",

			"vec2 p = ( gl_FragCoord.xy / 1600.0 );",
			"vec4 cga = texture2D(tDiffuse, vUv);",
			"gl_FragColor = vec4(cga.r, cga.g, cga.b * p.y * (1.+cos(time/1000.0))/2.0, 1.0);",


		"}"

	].join("\n")

};
