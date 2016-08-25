import React from 'react';
import { Row, Col } from 'react-bootstrap';
import lincsImage from '../../assets/img/hms_lincs_logo.png';
import bocoupImage from '../../assets/img/bocoup.png';
import './about.scss';

class About extends React.Component {

  /**
  * Render out JSX for About.
  * @return {ReactElement} JSX markup.
  */
  render() {
    return (
      <div className='about'>
        <Row>

          <Col md={12}>
            <h1>About</h1>
          </Col>

          <Col md={6}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis ex diam. Duis at vulputate sapien. Cras nec leo quis nunc iaculis aliquam id posuere est. Aliquam a sem lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque finibus at erat eu fermentum. Maecenas eros orci, lacinia hendrerit posuere ac, volutpat at elit. Aenean finibus augue quis dolor aliquam, at varius ex pulvinar. Morbi a nibh varius est varius feugiat. Etiam vitae rhoncus diam. Etiam aliquam consectetur tortor at consectetur. Vestibulum tellus risus, gravida vel sagittis eu, gravida a tellus. Nulla convallis viverra tincidunt. Nulla erat ante, rhoncus vitae turpis non, fringilla scelerisque enim.</p>
            <p>Mauris dignissim odio sed semper varius. Phasellus sit amet est vel nisl sodales hendrerit ac et justo. Donec nisl nisl, sagittis eu congue ac, tincidunt sed massa. Maecenas venenatis lorem risus, eu tincidunt tellus porttitor vitae. Phasellus pulvinar dui sed fringilla aliquet. Mauris eu varius nisi, eu congue mauris. Etiam convallis, dolor nec sodales facilisis, metus nisi sagittis nunc, semper accumsan turpis sapien eget ex. Proin tristique eu enim fermentum pharetra. In placerat massa sed augue bibendum commodo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec sed est sem. Sed vel turpis quis ligula pellentesque dapibus eget sed libero.</p>
          </Col>

          <Col md={6}>

            <Row>
              <a href='http://lincs.hms.harvard.edu/'>
                <img className='logo' src={lincsImage} />
              </a>
            </Row>

            <Row>
              <a href='http://bocoup.com/'>
                <img className='logo' src={bocoupImage} />
              </a>
            </Row>

          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
