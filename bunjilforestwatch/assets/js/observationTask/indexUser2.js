import { render } from 'react-dom';
import React from 'react';

import NavBar from '../navBar/navBar';
import VotingTaskBar from './votingTaskBar';
import GeoMapDisplay from './geoMapDisplay';
import Request from 'superagent';

import { uSizeFull } from '../../stylesheets/utils';

var IndexUser2 = React.createClass({
  getInitialState() {
    return {
      isTaskReady: false,
      areaId: -1,
      case: {},
      gladCluster: {}
    };
  },

  setNextTask() {
    this.setState({
      isTaskReady: false
    });
  },

  render() {
    let { state, setNextTask } = this;
    let votingTaskBar, geoMapDisplay;

    if (state.isTaskReady === true) {
      // Ugly ultra hacky data retrieval
      let coords = state.gladCluster.geojson.features[0].properties.points.coordinates[0];
      let long = coords[0];
      let lat = coords[1];

      votingTaskBar = <VotingTaskBar setNextTask={setNextTask} caseId={state.case.case_id} />;
      geoMapDisplay = <GeoMapDisplay long={long} lat={lat} />;
    } else {
      let self = this;

      // Fire off get request before component starts rendering
      Request
      .get('/observation-task/next')
      .end(
        function(err, res) {
          if (err === null && res.ok) {
            // Response is coming back as JSON string
            let response = JSON.parse(res.text);

            self.setState({
              isTaskReady: true,
              areaId: response.area_id,
              case: response.case,
              gladCluster: response.glad_cluster
            });
          }
        }
      );
    }

    return (
      <div>
        <NavBar />
        {votingTaskBar}
        {geoMapDisplay}
      </div>
    );
  }
});

render(
	<IndexUser2 />,
	document.getElementById('index-user2')
);