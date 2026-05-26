import React, { useState, useEffect } from 'react';
import './TreeAlert.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

interface TreeAlertProps {
  message: string;
  type?: AlertType;
  title?: string;
  onClose?: () => void;
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

const TreeAlert: React.FC<TreeAlertProps> = ({ 
  message, 
  type = 'info', 
  title, 
  onClose,
  isOpen,
  onOk,
  onCancel
}) => {
  const [visible, setVisible] = useState(isOpen);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimating(true);
    } else {
      setAnimating(false);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
    question: 'help'
  };

  return (
    <div className={`tree-alert-overlay ${animating ? 'show' : ''}`}>
      <div className={`tree-alert-board ${type}`}>
        
        {/* The Coconut Tree sticking out on the left */}
        <div className="coconut-tree-wrapper">
          <svg viewBox="0 0 200 300" className="coconut-tree-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Trunk */}
            <path d="M80,280 Q70,150 110,60 Q125,150 110,280 Z" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="2"/>
            <path d="M85,270 Q80,150 110,60 Q120,150 105,270 Z" fill="#A06A3B" />
            <path d="M90,260 Q85,150 110,60 Q115,150 100,260 Z" fill="#B07C4A" />
            
            {/* Trunk texture lines */}
            <path d="M80,240 Q100,250 115,240" fill="none" stroke="#5C3A21" strokeWidth="2"/>
            <path d="M75,200 Q100,210 118,200" fill="none" stroke="#5C3A21" strokeWidth="2"/>
            <path d="M75,160 Q100,170 120,160" fill="none" stroke="#5C3A21" strokeWidth="2"/>
            <path d="M80,120 Q105,130 120,120" fill="none" stroke="#5C3A21" strokeWidth="2"/>
            <path d="M90,90 Q110,100 120,90" fill="none" stroke="#5C3A21" strokeWidth="2"/>

            {/* Leaves (Tán lá) */}
            {/* Top Left */}
            <path d="M110,60 Q20,10 10,80 Q60,70 110,60" className="leaf-mid" />
            <path d="M110,60 Q20,10 10,80 Q60,70 110,60" fill="none" className="leaf-stroke" strokeWidth="1"/>
            <path d="M110,60 Q40,30 15,65 Q60,65 110,60" className="leaf-light" />
            
            {/* Top Right */}
            <path d="M110,60 Q190,0 195,70 Q140,65 110,60" className="leaf-mid" />
            <path d="M110,60 Q190,0 195,70 Q140,65 110,60" fill="none" className="leaf-stroke" strokeWidth="1"/>
            <path d="M110,60 Q170,25 185,60 Q140,60 110,60" className="leaf-light" />

            {/* Middle Left */}
            <path d="M110,60 Q-10,70 5,140 Q60,110 110,60" className="leaf-dark" />
            <path d="M110,60 Q-10,70 5,140 Q60,110 110,60" fill="none" className="leaf-stroke" strokeWidth="1"/>
            <path d="M110,60 Q20,80 15,120 Q60,100 110,60" className="leaf-mid" />

            {/* Middle Right */}
            <path d="M110,60 Q220,80 185,150 Q140,110 110,60" className="leaf-mid" />
            <path d="M110,60 Q220,80 185,150 Q140,110 110,60" fill="none" className="leaf-stroke" strokeWidth="1"/>
            <path d="M110,60 Q180,90 175,130 Q140,105 110,60" className="leaf-light" />

            {/* Bottom Left */}
            <path d="M110,60 Q40,130 35,180 Q80,120 110,60" className="leaf-mid" />
            
            {/* Bottom Right */}
            <path d="M110,60 Q160,130 160,190 Q120,120 110,60" className="leaf-dark" />

            {/* Coconuts */}
            <circle cx="95" cy="75" r="14" fill="#6B4226" stroke="#4A2E1B" strokeWidth="1"/>
            <circle cx="125" cy="70" r="12" fill="#5C3A21" stroke="#3A2415" strokeWidth="1"/>
            <circle cx="110" cy="85" r="15" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="1"/>
            
            {/* Coconut details */}
            <circle cx="106" cy="88" r="1.5" fill="#3A2415" />
            <circle cx="114" cy="88" r="1.5" fill="#3A2415" />
            <circle cx="110" cy="82" r="1.5" fill="#3A2415" />
          </svg>
        </div>

        {/* Board Content */}
        <div className="tree-alert-content">
          <div className="tree-alert-header">
            <span className="material-symbols-outlined alert-icon">{iconMap[type]}</span>
            {title && <h3 className="tree-alert-title">{title}</h3>}
            <button className="tree-alert-close" onClick={() => { if(onClose) onClose(); }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="tree-alert-body">
            <p>{message}</p>
            {type !== 'question' && (
              <div className="tree-alert-actions">
                <button 
                  className={`tree-alert-ok-btn ${type === 'success' ? 'success' : ''}`} 
                  onClick={() => { if(onOk) onOk(); else if(onClose) onClose(); }}
                  style={{ backgroundColor: type === 'success' ? 'var(--color-primary)' : 'var(--color-error)' }}
                >
                  OK
                </button>
              </div>
            )}
            {type === 'question' && (
              <div className="tree-alert-actions" style={{ gap: '10px' }}>
                <button className="tree-alert-cancel-btn" onClick={() => { if(onCancel) onCancel(); else if(onClose) onClose(); }}>
                  Không
                </button>
                <button className="tree-alert-confirm-btn" onClick={() => { if(onOk) onOk(); else if(onClose) onClose(); }}>
                  Có
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Wooden nails/screws for decoration */}
        <div className="wooden-nail top-left"></div>
        <div className="wooden-nail top-right"></div>
        <div className="wooden-nail bottom-left"></div>
        <div className="wooden-nail bottom-right"></div>
      </div>
    </div>
  );
};

export default TreeAlert;
