import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText, TSpan } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

const wheelData = [
  { label: 'Adopt a Tree' },
  { label: '1 Day National Park Pass' },
  { label: '+20 Points' },
  { label: 'Reusable Tote Bag' },
  { label: '+50 Points' },
  { label: 'Public Transport Credit' },
];

const WHEEL_SIZE = 300;

const Rewards = () => {
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotation = useSharedValue(0);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomTurns = Math.floor(Math.random() * 5) + 3;
    const anglePerSegment = 360 / wheelData.length;
    const randomOffset = Math.floor(Math.random() * anglePerSegment);
    const finalAngle = randomTurns * 360 + randomOffset;

    rotation.value = withTiming(finalAngle, { duration: 3000 }, () => {
      const winningIndex = Math.floor(((finalAngle % 360) + anglePerSegment) / anglePerSegment) % wheelData.length;
      runOnJS(setSelectedPrize)(wheelData[winningIndex].label);
      runOnJS(setIsSpinning)(false);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rewards Wheel</Text>

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
                
                const midAngle = (startAngle + endAngle) / 2;
                const textDistance = WHEEL_SIZE / 3.5; // Moves text inward for spacing
                const textX = WHEEL_SIZE / 2 + textDistance * Math.cos((Math.PI * midAngle) / 180);
                const textY = WHEEL_SIZE / 2 + textDistance * Math.sin((Math.PI * midAngle) / 180);

                const segmentColor = index % 2 === 0 ? '#DDF969' : '#78EC6C';

                return (
                  <G key={index}>
                    <Path
                      d={`M${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} L${x1},${y1} A${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} 0 ${largeArc},1 ${x2},${y2} Z`}
                      fill={segmentColor}
                      stroke="black"
                      strokeWidth="2"
                    />
                    <SvgText
                      x={textX}
                      y={textY}
                      fontSize={item.label.length > 15 ? "12" : "16"}
                      fill="black"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    >
                      {item.label.length > 15 ? (
                        <>
                          <TSpan x={textX} dy="-5">{item.label.split(" ").slice(0, 2).join(" ")}</TSpan>
                          <TSpan x={textX} dy="15">{item.label.split(" ").slice(2).join(" ")}</TSpan>
                        </>
                      ) : (
                        item.label
                      )}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity onPress={spinWheel} style={styles.button} disabled={isSpinning}>
        <Text style={styles.buttonText}>Spin the Wheel!</Text>
      </TouchableOpacity>

      {selectedPrize && <Text style={styles.resultText}>You won: {selectedPrize} </Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  wheelContainer: { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: 'center', justifyContent: 'center' },
  wheel: { position: 'absolute' },
  button: { marginTop: 20, backgroundColor: '#0288D1', padding: 12, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  resultText: { fontSize: 18, marginTop: 20, fontWeight: 'bold', color: '#333' },
});

export default Rewards;
