import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

const wheelData = [
  { label: '🎉 Prize 1' },
  { label: '🎁 Prize 2' },
  { label: '🏆 Prize 3' },
  { label: '🍀 Prize 4' },
];

const WHEEL_SIZE = 300;

export default function AboutScreen() {
  const [selectedPrize, setSelectedPrize] = useState(null);
  const rotation = useSharedValue(0);

  const spinWheel = () => {
    const randomTurns = Math.floor(Math.random() * 5) + 3; // Between 3 and 7 full turns
    const anglePerSegment = 360 / wheelData.length;
    const finalAngle = randomTurns * 360 + Math.floor(Math.random() * anglePerSegment);

    rotation.value = withTiming(finalAngle, { duration: 3000 }, () => {
      const winningIndex = Math.floor((finalAngle % 360) / anglePerSegment);
      runOnJS(setSelectedPrize)(wheelData[winningIndex].label);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ℹ️ About Page</Text>

      <View style={styles.wheelContainer}>
        <Animated.View style={[styles.wheel, animatedStyle]}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            <G rotation={-90} origin={`${WHEEL_SIZE / 2},${WHEEL_SIZE / 2}`}>
              {wheelData.map((item, index) => {
                const startAngle = (360 / wheelData.length) * index;
                const endAngle = startAngle + 360 / wheelData.length;
                const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                const x1 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos((Math.PI * startAngle) / 180);
                const y1 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.sin((Math.PI * startAngle) / 180);
                const x2 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos((Math.PI * endAngle) / 180);
                const y2 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.sin((Math.PI * endAngle) / 180);

                return (
                  <Path
                    key={index}
                    d={`M${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} L${x1},${y1} A${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={index % 2 === 0 ? '#FFA726' : '#FFEB3B'}
                    stroke="black"
                    strokeWidth="2"
                  />
                );
              })}
              {wheelData.map((item, index) => (
                <SvgText
                  key={index}
                  x={WHEEL_SIZE / 2}
                  y={WHEEL_SIZE / 6}
                  fontSize="16"
                  fill="black"
                  textAnchor="middle"
                  transform={`rotate(${(360 / wheelData.length) * index}, ${WHEEL_SIZE / 2}, ${WHEEL_SIZE / 2})`}
                >
                  {item.label}
                </SvgText>
              ))}
            </G>
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity onPress={spinWheel} style={styles.button}>
        <Text style={styles.buttonText}>Spin the Wheel!</Text>
      </TouchableOpacity>

      {selectedPrize && <Text style={styles.resultText}>You won: {selectedPrize} 🎊</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  wheelContainer: { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: 'center', justifyContent: 'center' },
  wheel: { position: 'absolute' },
  button: { marginTop: 20, backgroundColor: '#0288D1', padding: 10, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  resultText: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
});
