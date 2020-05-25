import React, { Component } from "react";
import { Pannellum } from "../../../src";
import PreviewImage from "./PreviewImage";
import Select from "react-select";
import classnames from "classnames";

import myImage1 from "../images/img1.jpg";
import myImage2 from "../images/img2.jpg";
import myImage3 from "../images/img3.jpg";

const imageOption = [
  { value: myImage1, label: "Image 1" },
  { value: myImage2, label: "Image 2" },
  { value: myImage3, label: "Image 3" },
];

export default class ImageDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yaww: 180,
      activeHotspot: {},
      activeThumbnail: myImage1,
      editListData: imageOption.map((option) => ({
        mediaPhoto: option.value,
        hotspots: [],
      })),
      viewMode: "edit",
      previewListData: [],
    };
    this.ref = React.createRef();
  }

  handleMouseDown = (event) => {
    const [pitch, yaw] = this.ref.current.getViewer().mouseEventToCoords(event);
    const { activeThumbnail, editListData } = this.state;
    const newViewList = editListData.map((view) => {
      if (view.mediaPhoto === activeThumbnail) {
        return { ...view, hotspots: [...view.hotspots, { pitch, yaw }] };
      } else {
        return view;
      }
    });
    this.setState({
      editListData: newViewList,
    });
  };

  handleChooseHotspot = (choosenHotspot) => {
    this.setState({
      activeHotspot: choosenHotspot,
    });
  };

  handleDeleteHotspot = (choosenHotspot) => {
    const { editListData, activeThumbnail } = this.state;
    const deletedViewList = editListData.map((view) => {
      if (view.mediaPhoto === activeThumbnail) {
        return {
          ...view,
          hotspots: view.hotspots.filter(
            (hotspot) => hotspot !== choosenHotspot
          ),
        };
      } else {
        return view;
      }
    });
    this.setState({
      editListData: deletedViewList,
    });
  };

  handleChangeDropdownImage = (choosenHotspot, { value }) => {
    const { editListData, activeThumbnail } = this.state;
    const newView = editListData.map((view) => {
      if (view.mediaPhoto === activeThumbnail) {
        const hotspots = view.hotspots.map((hotspot) =>
          hotspot === choosenHotspot ? { ...hotspot, image: value } : hotspot
        );
        return { ...view, hotspots };
      } else {
        return view;
      }
    });
    this.setState({
      editListData: newView,
    });
  };

  handleClickThumbnail = (choosenImage) => {
    this.setState({
      activeThumbnail: choosenImage,
    });
  };

  handleChangeMode = () => {
    const { viewMode, editListData } = this.state;
    this.setState({
      viewMode: viewMode === "edit" ? "preview" : "edit",
      previewListData: editListData,
    });
  };

  render() {
    const {
      activeHotspot,
      activeThumbnail,
      editListData,
      previewListData,
      viewMode,
    } = this.state;
    const activeView = editListData.find(
      (view) => view.mediaPhoto === activeThumbnail
    );
    const dropDownImage = imageOption.filter(
      (option) => option.value !== activeView.mediaPhoto
    );
    return (
      <div className="image_main">
        <button className="mode-btn" onClick={this.handleChangeMode}>
          {viewMode === "edit" ? "Preview Mode" : "Edit Mode"}
        </button>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            onClick={() =>
              this.setState((prevState) => ({ yaww: prevState.yaww - 50 }))
            }
          >
            left
          </button>
          <button
            onClick={() =>
              this.setState((prevState) => ({ yaww: prevState.yaww + 50 }))
            }
          >
            right
          </button>
          <h3>{this.state.updateText}</h3>
        </div>
        <h2 className="section_title">Image Component</h2>
        <div className="pannellum_div">
          {viewMode === "edit" && (
            <div className="edit-mode">
              <Pannellum
                ref={this.ref}
                height="400px"
                image={activeView.mediaPhoto}
                yaw={this.state.yaww}
                autoLoad
                author={this.state.author}
                onMousedown={this.handleMouseDown}
                draggable={false}
              >
                {activeView.hotspots.map((hotspot) => (
                  <Pannellum.Hotspot
                    key={hotspot.pitch}
                    type="custom"
                    pitch={hotspot.pitch}
                    yaw={hotspot.yaw}
                    handleClick={() => this.handleChooseHotspot(hotspot)}
                  />
                ))}
              </Pannellum>
              <div className="control-view">
                <div className="thumbnail-list">
                  {imageOption.map((image) => (
                    <div
                      key={image.value}
                      className={classnames("thumbnail-item", {
                        "active-thumbnail": image.value === activeThumbnail,
                      })}
                      onClick={() => this.handleClickThumbnail(image.value)}
                    >
                      <img src={image.value} alt={image.label} />
                    </div>
                  ))}
                </div>
                <div className="hotspot-list">
                  <h3>hotspots list</h3>
                  {activeView.hotspots.map((hotspot) => {
                    const defaultInputValue = dropDownImage.find(
                      (image) => image.value === hotspot.image
                    );
                    return (
                      <div
                        key={hotspot.yaw}
                        className={classnames("list-item", {
                          "active-hotspot":
                            hotspot.pitch === activeHotspot.pitch,
                        })}
                      >
                        <span className="hotspot-item">
                          {Math.round(hotspot.pitch)}
                        </span>
                        <button
                          onClick={() => this.handleDeleteHotspot(hotspot)}
                        >
                          X
                        </button>
                        <Select
                          className="image-dropdown"
                          defaultInputValue={
                            defaultInputValue && defaultInputValue.label
                          }
                          options={dropDownImage}
                          onChange={(e) =>
                            this.handleChangeDropdownImage(hotspot, e)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {viewMode === "preview" && (
            <PreviewImage
              data={previewListData}
              activeThumbnail={activeThumbnail}
            />
          )}
        </div>
      </div>
    );
  }
}
