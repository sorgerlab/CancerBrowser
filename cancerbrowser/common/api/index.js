
import * as CellLine from './cell_line';
import * as Drug from './drug';
import * as Dataset from './dataset';
import * as Receptor from './receptor';

export default {
  ...CellLine,
  ...Drug,
  ...Dataset,
  ...Receptor
};
