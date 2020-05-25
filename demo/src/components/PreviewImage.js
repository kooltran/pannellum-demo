import React from "react";
import classnames from 'classnames';
import { Pannellum } from "../../../src";

export default class PreviewImage extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      activeView: props.data[0],
    };
  }

  handleClickHotspot = (hotspot) => {
    const { data } = this.props;
    this.setState({
      activeView: data.find((item) => item.mediaPhoto === hotspot.image),
    });
  };

  render() {
    const { activeView } = this.state;
    return (
      <Pannellum
        ref={this.ref}
        height="400px"
        image={activeView.mediaPhoto}
        yaw={activeView.hotspot ? activeView.hotspots[0].yaw : 180}
        autoLoad
        author="kool"
      >
        {activeView.hotspots.map((hotspot) => {
          return (
            <Pannellum.Hotspot
                key={hotspot.pitch}
                type="custom"
                pitch={hotspot.pitch}
                yaw={hotspot.yaw}
                handleClick={() => this.handleClickHotspot(hotspot)}
                cssClass={classnames({
                  'hide-hotspot': !hotspot.image
                })}
              />
          );
        })}
      </Pannellum>
    );
  }
}
