import d3 from 'd3';
import _ from 'lodash';

/*
 * Creates a list of points to sample at based on a power scale.
 * This sampler works well when the x scale is a log scale
 *
 * @param {Number} exponent What exponent to use in the power scale
 * @param {Number} numSamples The number of samples to take
 * @param {Array} sampleRange The range from which the samples should be taken
 * @return {Array} Array of points to sample at
 */
export function powerSampler({ exponent, numSamples, sampleRange }/*, datum, func */) {
  const sampleScale = d3.scale.pow().exponent(exponent).domain([1, numSamples]).range(sampleRange);
  const samplePoints = _.range(numSamples).map(i => {
    const x = sampleScale(i + 1);
    return x;
  });

  return samplePoints;
}
