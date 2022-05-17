import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(null);
	const [UserToken, setUserToken] = useState(null)
	//<ScreenSpinner size='large' />

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
			bridge.send("VKWebAppInit");
            const token = await bridge.send("VKWebAppGetAuthToken", {"app_id": 8047764, "scope": "friends,photos,video,stories,pages,status,notes,wall,docs,groups,stats,market"});
            if(token.access_token != null){
                setUserToken(token.access_token)
            }else{
                token = await bridge.send("VKWebAppGetAuthToken", {"app_id": 8047764, "scope": "friends,photos,video,stories,pages,status,notes,wall,docs,groups,stats,market"});
            }
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
	<ConfigProvider appearance="dark">
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} >
					<Home id='home' go={go} usertoken={UserToken}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	</ConfigProvider>
	);
}

export default App;
