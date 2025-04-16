/**
 * @property {boolean} loading
 * @property {boolean} success
 * @property {boolean} error
 * @property {Array} data
 * */
export interface PropertyState {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: any[];
}

export const PropertyInitialState: PropertyState = {
  loading: false,
  success: false,
  error: false,
  data: [],
};
