export function fetchNeeds( props, needs ){
	const { params, dispatch } = props;
	needs.map( need => dispatch(need(params)) )
}
