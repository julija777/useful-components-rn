import React from 'react';
import { Svg, Path } from 'react-native-svg';

const FlameIcon = ({ size = 100, color = '#FFFFFF' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"

    >
      <Path
        d="M50 5C50 5 75 25 75 50C75 65 60 75 50 85C40 75 25 65 25 50C25 25 50 5 50 5Z"
        fill={color}
      />
    </Svg>
  );
};

export default FlameIcon;