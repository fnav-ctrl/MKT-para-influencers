import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { Ejercicio } from "./Ejercicio";
import { CampoTexto, CampoNumero, ListaCampos } from "./fields";
import { CalculadoraTMV } from "./CalculadoraTMV";
import { TablaPaquetes } from "./TablaPaquetes";
import { Semaforo } from "./Semaforo";
import { Tablero5Metricas } from "./Tablero5Metricas";
import { MatrizMix } from "./MatrizMix";
import { Checklist } from "./Checklist";
import { BarraProgreso } from "./BarraProgreso";

// Mapa de componentes disponibles dentro de los capítulos MDX.
export const mdxComponents: MDXComponents = {
  Callout,
  Ejercicio,
  CampoTexto,
  CampoNumero,
  ListaCampos,
  CalculadoraTMV,
  TablaPaquetes,
  Semaforo,
  Tablero5Metricas,
  MatrizMix,
  Checklist,
  BarraProgreso,
};
