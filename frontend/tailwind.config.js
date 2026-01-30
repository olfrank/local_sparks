/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
<<<<<<< HEAD
  		fontFamily: {
  			sans: [
  				'Host Grotesk',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif',
  			],
  			display: [
  				'Host Grotesk',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif',
  			],
  		},
  		letterSpacing: {
  			'heading': '-0.02em',
  			'heading-h2': '-0.015em',
  			'heading-tight': '-0.01em',
  		},
=======
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
<<<<<<< HEAD
  			// Hybrid Dark Theme
  			ink: 'hsl(var(--bg))',
  			surface: 'hsl(var(--surface))',
  			surface2: 'hsl(var(--surface2))',
  			text: 'hsl(var(--text))',
  			muted: 'hsl(var(--muted))',
  			border: 'hsl(var(--border))',
  			light: {
  				bg: 'hsl(var(--lightBg))',
  				surface: 'hsl(var(--lightSurface))',
  				text: 'hsl(var(--lightText))',
  				muted: 'hsl(var(--lightMuted))',
  				border: 'hsl(var(--lightBorder))',
  			},
  			// Legacy shadcn compatibility
=======
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
<<<<<<< HEAD
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			success: 'hsl(var(--success))',
=======
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
<<<<<<< HEAD
  		fontSize: {
  			'h1': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 40px mobile – weight/tracking via .cg-h1
  			'h1-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 56px desktop
  			'h2': ['1.625rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }], // 26px mobile – weight/tracking via .cg-h2
  			'h2-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }], // 40px desktop
  		},
  		borderRadius: {
  			'xl': '1rem', // 16px
  			'2xl': '1.5rem', // 24px
  		},
=======
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
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
<<<<<<< HEAD
  			},
  			'fade-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
=======
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
<<<<<<< HEAD
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.25s ease-out',
  			'slide-in': 'slide-in 0.25s ease-out'
=======
  			'accordion-up': 'accordion-up 0.2s ease-out'
>>>>>>> 86bf1def2d30dd3d6e69e897f3a11ea0d1a0ef39
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};