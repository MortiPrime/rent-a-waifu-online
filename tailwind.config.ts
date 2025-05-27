
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#FF6B9D',
					foreground: '#FFFFFF',
					50: '#FFF0F5',
					100: '#FFE1EA',
					200: '#FFC3D6',
					300: '#FF9BB8',
					400: '#FF6B9D',
					500: '#FF4582',
					600: '#E63567',
					700: '#CC2654',
					800: '#A61E45',
					900: '#7A1733',
				},
				secondary: {
					DEFAULT: '#8B5FBF',
					foreground: '#FFFFFF',
					50: '#F5F2FF',
					100: '#EBE5FF',
					200: '#D7CCFF',
					300: '#BBA8FF',
					400: '#9B7FFF',
					500: '#8B5FBF',
					600: '#7B4FA3',
					700: '#6B3F87',
					800: '#5B2F6B',
					900: '#4B1F4F',
				},
				accent: {
					DEFAULT: '#FFE4E6',
					foreground: '#FF6B9D'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #FF6B9D 0%, #8B5FBF 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #FFE4E6 0%, #F5F2FF 100%)',
				'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(255, 107, 157, 0.1)',
				'card-hover': '0 20px 25px -5px rgba(255, 107, 157, 0.1), 0 10px 10px -5px rgba(255, 107, 157, 0.04)',
				'premium': '0 0 0 1px rgba(255, 107, 157, 0.1), 0 25px 50px -12px rgba(255, 107, 157, 0.25)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
