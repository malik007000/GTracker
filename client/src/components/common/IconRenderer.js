import React from 'react';
import {
  FiHeart,
  FiSunrise,
  FiSun,
  FiSunset,
  FiMoon,
  FiBook,
  FiCircle,
  FiActivity,
  FiXCircle,
  FiTarget,
  FiStar
} from 'react-icons/fi';

const IconRenderer = ({ iconType, style = {}, size = 16 }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'spiritual':
        return <FiHeart style={style} size={size} />;
      case 'sunrise':
        return <FiSunrise style={style} size={size} />;
      case 'sun':
        return <FiSun style={style} size={size} />;
      case 'sunset':
        return <FiSunset style={style} size={size} />;
      case 'moon':
        return <FiMoon style={style} size={size} />;
      case 'book':
        return <FiBook style={style} size={size} />;
      case 'meditation':
        return <FiCircle style={style} size={size} />;
      case 'heart':
        return <FiHeart style={style} size={size} />;
      case 'activity':
        return <FiActivity style={style} size={size} />;
      case 'x_circle':
        return <FiXCircle style={style} size={size} />;
      case 'target':
        return <FiTarget style={style} size={size} />;
      default:
        return <FiStar style={style} size={size} />;
    }
  };

  return getIcon();
};

export default IconRenderer;
