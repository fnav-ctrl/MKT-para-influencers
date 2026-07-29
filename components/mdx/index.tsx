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
import { Canvas9 } from "./Canvas9";
import { Radiografia6Meses } from "./Radiografia6Meses";
import { Referencia } from "./Referencia";
import { DescargaKit } from "./DescargaKit";
import { SerieCompletaCTA } from "./SerieCompletaCTA";

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
  Canvas9,
  Radiografia6Meses,
  Referencia,
  DescargaKit,
  SerieCompletaCTA,
};
