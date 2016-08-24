import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { toList } from '../../utils/string_utils';

import PageLayout from '../../components/PageLayout';
import InfoPanel from '../../components/InfoPanel';
import { drugImageUrl } from '../../components/DrugCard';

import {
  fetchDrugInfoIfNeeded
} from '../../actions/drug';

import {
  getDrug
} from '../../selectors/drug';

const propTypes = {
  dispatch: React.PropTypes.func,
  params: React.PropTypes.object,
  drugInfo: React.PropTypes.object
};

function mapStateToProps(state, ownProps) {

  const drug = getDrug(state, ownProps);
  return {
    drugInfo: drug
  };
}

/**
 * Container component for contents of Company page content.
 */
class DrugDetailPage extends React.Component {

  /**
   * Render info panel component with drug info.
   */
  renderInfo(drugInfo) {
    const details = [
      { label: 'Class', value: drugInfo.class ? drugInfo.class.label : '' },
      { label: 'LINCS ID', value: drugInfo.hmsLincsId },
      { label: 'Synonyms', value: toList(drugInfo.synonyms) },
      { label: 'Target Gene', value: drugInfo.targetGene ? drugInfo.targetGene.label : '' },
      { label: 'Target Role', value: drugInfo.targetRole ? drugInfo.targetRole.label : '' },
      { label: 'Target Pathway', value: drugInfo.targetPathway ? drugInfo.targetPathway.label : ''},
      { label: 'Target Function', value: drugInfo.targetFunction ? drugInfo.targetFunction.label : '' },
      { label: 'Target Protein', value: drugInfo.targetProtein ? drugInfo.targetProtein.label : ''},
      { label: 'Target Protein Class', value: drugInfo.targetProteinClass ? drugInfo.targetProteinClass.label : ''}
    ];

    return (
      <InfoPanel details={details} />
    );
  }


  /**
   * Renders list of associated datasets for clicking
   */
  renderDatasets(drugInfo) {
    const links = drugInfo.dataset.map((dataset) => {
      return <Link to={`/dataset/${dataset.value}/${drugInfo.id}/drug`} className="" >{dataset.label}</Link>;
    });

    return (
      <ul className="datasets">
        {links.map((link, index) => <li key={index}>{link}</li>)}
      </ul>
    );
  }

  /**
   * Render out JSX for DrugDetailPage.
   * @return {ReactElement} JSX markup.
   */
  render() {

    const { drugInfo } = this.props;


    if(drugInfo) {

      return (
        <PageLayout className='DrugDetailPage'>
          <h1 className='name'>{ drugInfo.name ? drugInfo.name.label : '' }</h1>
          <img src={drugImageUrl(drugInfo)} />
          <div>
            <h3>General Information</h3>
            {this.renderInfo(drugInfo)}
          </div>
          <div>
            <h3>Dataset Displays</h3>
            {this.renderDatasets(drugInfo)}
          </div>
        </PageLayout>
      );
    } else {
      return(
        <PageLayout className="CellLineDetailPage">
        </PageLayout>
      );
    }
  }
}

DrugDetailPage.propTypes = propTypes;

export default connect(mapStateToProps)(DrugDetailPage);
