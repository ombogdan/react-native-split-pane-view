/**
 * Created by ombogdan on 2021-08-03.
 */

import React, {useState, useEffect} from 'react';
import {
    Dimensions,
    Image,
    View,
} from 'react-native';

const Pane = ({flexible = false, children, onLayout, style, secondComponent}) => {
        return (
            <>
                {secondComponent === true ?
                    <View style={[flexible ? {height: '100%'} : style]}
                          onLayout={onLayout}>
                        {children}
                    </View>
                    :
                    <View style={[flexible ? {height: '100%'} : style]}>
                        {children}
                    </View>
                }
            </>
        )
    }
;

let startPos = {x: 0, y: 0,};
let dragging = false;
const Separator = ({startDrag, onDragging, endDrag, splitSource, splitStyle, splitContainerStyle}) => {
    function onStartShouldSetResponder() {
        return true;
    }

    function onResponderGrant(evt) {
        const {pageX, pageY} = evt.nativeEvent;
        startPos.x = pageX;
        startPos.y = pageY;
        dragging = true;
        startDrag(startPos);
    }

    function onResponderMove(evt) {
        const {pageX, pageY} = evt.nativeEvent;

        onDragging({
            x: pageX - startPos.x,
            y: pageY - startPos.y,
        });
    }

    function onResponderRelease(evt) {
        const {pageX, pageY} = evt.nativeEvent;
        endDrag({
            x: pageX - startPos.x,
            y: pageY - startPos.y,
        });
        dragging = false;
    }

    return (
        <View style={[splitContainerStyle ? splitContainerStyle : {
            width: '100%',
            alignItems: "center",
            bottom: 15,
            zIndex: 2000
        }]}
              onStartShouldSetResponder={onStartShouldSetResponder}
              onResponderGrant={onResponderGrant}
              onResponderMove={onResponderMove}
              onResponderRelease={onResponderRelease}>
            <Image style={[splitStyle ? splitStyle : {width: 30, height: 30}]}
                   source={splitSource}
            />
        </View>
    )
};

let startSize;
export default (
    {
        split = 'h',
        primary = 'first',
        children,
        style,
        defaultValue,
        value,
        onChange,
        onFinish,
        min = 0,
        max,
        splitSource,
        splitStyle,
        splitContainerStyle,
        orientation
    }
) => {

    const wrapperStyle = [style];
    const posKey = split === 'h' ? 'x' : 'y';
    const sizeKey = split === 'h' ? 'width' : 'height';

    const [primarySize, setPrimarySize] = useState(value || defaultValue);

    const [dragging, setDragging] = useState(false);

    const isHorizontal = split === 'h';
    if (isHorizontal) {
        wrapperStyle.push({flexDirection: 'row'})
    }

    function onLayout() {
        if (dragging) return;
        if (orientation !== 'PORTRAIT' && (Dimensions.get('window').height - 150 < primarySize)) {
            setPrimarySize(Dimensions.get('window').height / 2);
        }
    }

    function startDrag() {
        setDragging(true);
        startSize = {[sizeKey]: primarySize}

    }

    function onDragging(offset, returnValue) {
        const sign = primary !== 'first' ? -1 : 1;
        value = Math.max(startSize[sizeKey] + sign * offset[posKey], min);
        if (max !== undefined) {
            value = Math.min(value, max);
        }
        setPrimarySize(value);
        onChange && onChange(value);
        if (returnValue === true) {
            return value;
        }
    }

    function endDrag(value) {
        let resultValue = onDragging(value, true)
        onFinish(resultValue, true);
        setDragging(false);
    }

    useEffect(() => {
        setPrimarySize(value || defaultValue)
    }, [value]);

    const paneStyle = {
        [sizeKey]: primarySize - 10,
    };

    return (
        <View style={wrapperStyle} pointerEvents={"auto"}>
            <Pane style={paneStyle}

                  flexible={primary !== 'first'}>{children[0]}</Pane>
            <Separator
                honrizontal={isHorizontal}
                onDragging={onDragging}
                startDrag={startDrag}
                endDrag={endDrag}
                splitSource={splitSource}
                splitStyle={splitStyle}
                splitContainerStyle={splitContainerStyle}/>
            <Pane style={paneStyle}
                  flexible={primary !== 'second'}
                  onLayout={() => {
                      onLayout()
                  }}
                  secondComponent={true}
            >{children[1]}</Pane>
        </View>
    );
}
