declare module "plotly.js-dist-min" {
  export function newPlot(
    root: string | HTMLElement,
    data: object[],
    layout?: object,
    config?: object
  ): Promise<void>;
}
