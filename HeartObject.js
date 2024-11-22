/***
 * Bilibili: codeArt
 ***/
import { Points, THREE } from "./AppImport.js";
import HeartCurve from "./HeartCurve.js";
import { SimplexNoise } from "./tools/SimplexNoise.js";

export default class HeartObject extends Points {
  constructor(isInner) {
    super();
    this.isInner = isInner;
    this.clock = new THREE.Clock(true);
    this.pointScales = [];
    this.expandTime = 0.7;
    this.shrinkTime = 0.7;

    const path = new HeartCurve(1, isInner);
    let pointNum = 160;
    if (isInner) {
      pointNum = 260;
    }

    const geometry = new THREE.TubeGeometry(path, pointNum, 0.2, 35, true);

    // const geometry = new THREE.BufferGeometry().setFromPoints(
    //   path.getPoints(10000)
    // );

    let color;
    if (isInner) {
      // color = new THREE.Color(250 / 255.0, 179 / 255.0, 205 / 255.0);
      color = new THREE.Color(250 / 255.0, 155 / 255.0, 190 / 255.0);
    } else {
      // color = new THREE.Color(240 / 255.0, 111 / 255.0, 132 / 255.0);
      color = new THREE.Color(240 / 255.0, 100 / 255.0, 123 / 255.0);
    }
    const material = new THREE.PointsMaterial({
      size: 0.2,
      color: color,
      sizeAttenuation: true,
    });

    const shaderMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color: {
          value: color,
        },
      },
      vertexShader: `
        float random (in vec2 st) {
          return fract(sin(dot(st.xy,
                      vec2(12.9898,78.233)))
                      * 43758.5453123);
        }
        float noise (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) +
                  (c - a)* u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
        }
        void main(){
          gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0);
          //分形噪波
          float noiseResult = 4.2*(noise(position.xy*2.5) + 0.8*noise(position.xy+3.4)+noise(position.xy*0.8))*random(position.xy);
          //noiseResult = 4.5*random(position.xy);
          // noiseResult = 4.0*noise(vec2(position.x+3.0,position.y*2.0+0.2));
          // noiseResult += 2.0*noise(position.xy*5.2);
          // noiseResult += 0.5*noise(position.xy*4.2);
          // noiseResult += 1.0*noise((position.xy+3.2)*3.8+10.3)*random(position.xy);
          gl_PointSize = noiseResult;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main(){
          float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
          strength = step(0.5,strength);
          gl_FragColor = vec4(color,strength);
        }
      `,
    });

    this.geometry = geometry;
    this.material = shaderMaterial;
    this.isAnimated = false;
    this.updatePoints(false);
  }

  updatePoints(isAnimated) {
    const points = this.geometry.getAttribute("position");

    for (let i = 0; i < points.count; i++) {
      const point = new THREE.Vector3(
        points.getX(i),
        points.getY(i),
        points.getZ(i)
      );
      let newPoint;
      if (isAnimated) {
        const oringinPoint = new THREE.Vector3(
          this.originPoints.getX(i),
          this.originPoints.getY(i),
          this.originPoints.getZ(i)
        );

        newPoint = this.animatePoint(oringinPoint, this.pointScales[i]);
      } else {
        newPoint = this.translatePostion(point);

        //动画初始状态
        const basePoint = new THREE.Vector3(0, 0, 0);
        let distance = newPoint.distanceTo(basePoint);
        const strength = 20; //跳动强度
        distance = rangeMap(distance, 0, strength, 0, 1);
        const weight = 0.2;
        let scale = -weight * Math.log(distance);
        this.pointScales.push(scale);
      }
      points.setX(i, newPoint.x);
      points.setY(i, newPoint.y);
      points.setZ(i, newPoint.z);
    }
    if (!isAnimated) {
      this.originPoints = points.clone();
    }
  }

  translatePostion(point) {
    let position = point;
    let basePoint = new THREE.Vector3(0, 0, 0);
    let transVector = basePoint.sub(position);

    let logStrength = 0.2;
    if (this.isInner) {
      logStrength = 0.15;
    }
    //对数函数映射
    const shift = -logStrength * Math.log(Math.random());
    transVector = transVector.multiplyScalar(shift);
    position = position.add(transVector);

    //分形噪波
    if (this.isInner) {
      position = this.noisePosition(position, 2);
    } else {
      position = this.noisePosition(position, 2);
    }
    return position;
  }

  noisePosition(originPosition, weight) {
    let x = originPosition.x;
    let y = originPosition.y;
    let z = originPosition.z;
    const simplexNoise = new SimplexNoise();
    let noiseValue = simplexNoise.noise3d(x, y, z);
    x += weight * (Math.random() - 0.5) * noiseValue;
    y += weight * (Math.random() - 0.5) * noiseValue;
    z += weight * (Math.random() - 0.5) * noiseValue;
    return new THREE.Vector3(x, y, z);
  }

  animate(time) {
    this.time = time;
    if (this.clock.getElapsedTime() > this.expandTime + this.shrinkTime + 0.1) {
      this.clock.start();
    }
    this.updatePoints(true);
  }

  animatePoint(point, scale) {
    const expandTime = this.expandTime;
    const shrinkTime = this.shrinkTime;

    let newPoint;
    let nowScale;
    if (this.clock.elapsedTime < expandTime) {
      const passedTime = this.clock.elapsedTime;
      const ft = easingOut(rangeMap(passedTime, 0, expandTime, 0, 1), 50);
      // const ft = rangeMap(passedTime, 0, expandTime, 0, 1);
      nowScale = (scale / expandTime) * ft;

      newPoint = point.multiplyScalar(1 + nowScale);
      if (!this.isInner) {
        newPoint = this.noisePosition(newPoint, 10);
      }
    } else if (this.clock.elapsedTime < shrinkTime + expandTime) {
      const passedTime = shrinkTime + expandTime - this.clock.elapsedTime;

      const ft = easing(rangeMap(passedTime, 0, shrinkTime, 0, 1), 50);
      // const ft = rangeMap(passedTime, 0, shrinkTime, 0, 1);
      nowScale = (scale / shrinkTime) * ft;

      newPoint = point.multiplyScalar(1 + nowScale);
      if (!this.isInner) {
        newPoint = this.noisePosition(newPoint, 6);
      }
    } else {
      // nowScale = 0;
      newPoint = point;
      if (!this.isInner) {
        newPoint = this.noisePosition(newPoint, 1);
      }
    }
    return newPoint;
  }
}

//0到1 缓进插值
function easing(t, power) {
  return (Math.pow(power, t) - 1) / (Math.pow(power, 1) - 1);
}
//0-1缓出插值
function easingOut(t, power) {
  return (1 - Math.pow(power, -t)) / (1 - Math.pow(power, -1));
}

//将x,y区间映射到u,v区间
function rangeMap(value, x, y, u, v) {
  const newValue = (value * (v - u)) / (y - x);
  return newValue;
}

// function easing(nowTime, totalTime, start, end) {
//   //映射到指数变量作用域
//   const timeValue = rangeMap(nowTime, 0, totalTime, -6, 0);
//   const fx = Math.pow(2, timeValue); //0到1插值
//   //映射回原值
//   const place = rangeMap(fx, start, end, 0, 1);
//   return place;
// }
