# react-native-split-pane-view

Split pane

# Install

`npm i react-native-split-pane-view`
or
`yarn add react-native-split-pane-view`

It depends on `react-native-app-interface`, so should execute `pod install` after install script

# Shortcuts

![open](https://raw.githubusercontent.com/ombogdan/react-native-split-pane-view/master/assets/example.gif)

# Usage

```jsx harmony
import React, {PureComponent, useState} from "react";
import {Dimensions, View, Text} from "react-native";
import SplitPane from 'react-native-split-pane-view';

export default () => {
    const [sliderValue, setSliderValue] = useState(Dimensions.get('window').height * 0.4);
    const [orientation, setOrientation] = useState("PORTRAIT");

    onChangeSliderValue = (value, finish) => {
        try {
            if (finish === true) {
                setSliderValue(value)
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <SplitPane
            splitSource={require('./assets/horizontal-split.png')}
            splitContainerStyle={{width: '100%', alignItems: "center", bottom: 5, zIndex: 2000}}
            split="v"
            primary='first'
            defaultValue={Dimensions.get('window').height * 0.6}
            min={Dimensions.get('window').height * 0.05}
            max={Dimensions.get('window').height * 0.8}
            onChange={this.onChangeSliderValue.bind(this)}
            onFinish={this.onChangeSliderValue.bind(this)}
            orientation={orientation}
        >
            <View style={{height: sliderValue}}><Text>A</Text></View>
            <View style={{height: Dimensions.get('window').height - sliderValue}}><Text>B</Text></View>
        </SplitPane>
    );
}
```

# Props

| prop | type | required | default |
| ---- | ---- | ----     | ----    |
|splitSource | string | true | './assets/horizontal-split.png'|
|splitContainerStyle | object | false | |
|split  | 'h' or 'v' | false | 'h' |
|primary  | 'first' or 'second' | false | 'first' |
|defaultValue | number | true | |
|min  | number | false | 0 |
|max | number | false | |
|onChange | (value)=>void | true | |
|onFinish | (value)=>void | false | |
|orientation | string | false | |

