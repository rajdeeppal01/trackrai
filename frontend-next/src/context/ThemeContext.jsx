"use client";

import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
 const [theme, setTheme] = useState('dark')

 useEffect(() => {
 const savedTheme = localStorage.getItem('trackrai_theme')
 if (savedTheme) {
 setTheme(savedTheme)
 }
 }, [])

 useEffect(() => {
 const root = document.documentElement
 root.setAttribute('data-theme', theme)
 localStorage.setItem('trackrai_theme', theme)
 }, [theme])

 const themes = ['dark', 'light', 'cyberpunk', 'midnight']

 const toggleTheme = () => {
 setTheme(current => {
 const currentIndex = themes.indexOf(current)
 const nextIndex = (currentIndex + 1) % themes.length
 return themes[nextIndex]
 })
 }

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 )
}

export const useTheme = () => useContext(ThemeContext)
