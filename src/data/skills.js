import {
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNodedotjs,
  SiArduino,
  SiGit,
  SiUnity,
  SiVite,
  SiTailwindcss,
  SiPython,
  SiRaspberrypi
} from 'react-icons/si'
import { FaGamepad } from 'react-icons/fa'
import { VscCode } from 'react-icons/vsc'

export const skills = {
  languages: [
    { name: 'JavaScript', icon: SiJavascript, level: 90, color: '#f7df1e', certId: 'placeholder-1' },
    { name: 'C++', icon: SiCplusplus, level: 85, color: '#00599c' },
    { name: 'HTML5', icon: SiHtml5, level: 95, color: '#e34f26', certId: 'placeholder-1' },
    { name: 'CSS3', icon: SiCss3, level: 90, color: '#1572b6', certId: 'placeholder-1' },
    { name: 'TypeScript', icon: SiTypescript, level: 75, color: '#3178c6' },
    { name: 'Python', icon: SiPython, level: 70, color: '#3776ab' },
  ],
  frameworks: [
    { name: 'React', icon: SiReact, level: 90, color: '#61dafb', certId: 'placeholder-1' },
    { name: 'Node.js', icon: SiNodedotjs, level: 80, color: '#339933' },
    { name: 'Vite', icon: SiVite, level: 85, color: '#646cff' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, level: 90, color: '#06b6d4' },
    { name: 'Phaser', icon: FaGamepad, level: 75, color: '#8cc63f' },
  ],
  tools: [
    { name: 'Git', icon: SiGit, level: 85, color: '#f05032' },
    { name: 'VS Code', icon: VscCode, level: 95, color: '#007acc' },
    { name: 'Unity', icon: SiUnity, level: 80, color: '#ffffff' },
  ],
  hardware: [
    { name: 'Arduino', icon: SiArduino, level: 85, color: '#00979d' },
    { name: 'Raspberry Pi', icon: SiRaspberrypi, level: 80, color: '#c51a4a' },
  ],
}
