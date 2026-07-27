import { useEffect } from 'react'

export default function useDocumentTitle(title, description = null) {
 useEffect(() => {
 document.title = `${title} | TrackrAI`

 if (description) {
 let metaDescription = document.querySelector('meta[name="description"]')
 if (!metaDescription) {
 metaDescription = document.createElement('meta')
 metaDescription.setAttribute('name', 'description')
 document.head.appendChild(metaDescription)
 }
 metaDescription.setAttribute('content', description)

 // Also update Open Graph description
 let ogDescription = document.querySelector('meta[property="og:description"]')
 if (ogDescription) ogDescription.setAttribute('content', description)
 
 let twDescription = document.querySelector('meta[property="twitter:description"]')
 if (twDescription) twDescription.setAttribute('content', description)
 }
 }, [title, description])
}
