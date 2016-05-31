
import { getDataset } from './dataset';

export function getReceptors() {
  let datasetId = 'receptor_profile';
  return getDataset(datasetId).then((receptorData) => {
    return receptorData[0].measurements.map((measurement) => {

      return {label: measurement.receptor, value: measurement.receptor.toLowerCase()};
    });
  });
}
