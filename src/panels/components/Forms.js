import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, Panel, Header, PanelHeader, Group, CardGrid, Card, FormLayout, FormLayoutGroup, FormItem, Input, CellButton, Cell, Button, Avatar, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import axios from 'axios';

import { Icon28Search } from '@vkontakte/icons';

class GeoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '52.795353',
      long: '41.974255',
      count: '600',
      radius: '10000',
      v: '5.131',
      showDates: true,
      popout: null,
      lists: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  }
  async handleSubmit(e) {
    this.setState({ ...this.state, lists: [] })
    this.setState ({ popout: <ScreenSpinner size='large' /> });
    e.preventDefault();
    let x = await bridge.send("VKWebAppCallAPIMethod", {
        "method": "photos.search",
        "params": {
            "lat": this.lat,
            "long": this.long,
            "count": "600",
            "radius": this.radius, 
            "v":"5.131",
            "access_token": this.props.usertoken
            }
      }).then((r) => {
        this.setState({ ...this.state, lists: r.response.items })
        this.setState({ popout: null });
        })
      }
  toggleDates(showDates) {
    this.setState({ showDates });
  }

  render() {
    const { showDates, lat, long, count, radius, lists, popout } = this.state;

    return (
      <View activePanel="GeoForm" popout={popout}>
        <Panel id="GeoForm">
          <Group>
            <FormLayout onSubmit={this.handleSubmit}>
              <FormLayoutGroup mode="vertical" >
                <FormItem top="Высота">
                  <Input name="lat" placeholder={lat} onChange={this.handleChange}/>
                </FormItem>
                <FormItem top="Ширина">
                  <Input name="long" placeholder={long} onChange={this.handleChange}/>
                </FormItem>
                <FormItem top="Радиус (10км)">
                  <Input name="radius" placeholder={radius} onChange={this.handleChange}/>
                </FormItem>
              </FormLayoutGroup>
              <Div>
              <Input type="submit" value="Посмотреть" onSubmit={this.handleSubmit} />
			  </Div>
				
            </FormLayout>
          </Group>
          <Group>
          <Header align="center">{lists.length}</Header>
          {lists.map(list =>{
            return (
			<Group description={list.owner_id} onClick={()=>location.href=`https://vk.com/id${list.owner_id}`}>
              <CardGrid size="s">
                <img src={list.sizes[1].url}/><br/>
                  <pre>
                    {list.text}
                  </pre>
              </CardGrid>
            </Group>)
          })}
          
          
          </Group>
        </Panel>
      </View>
    );
  }
}

export default GeoForm;
