import { Helmet } from "react-helmet-async";

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DizItUp",
    "alternateName": "Diz Your Business",
    "url": "https://dizitup.com",
    "logo": "https://dizitup.com/logo.png",
    "description": "AI-powered digital marketing and automation agency offering website development, workflow automation, branding, video editing, and graphic design services in India.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "dizitup@outlook.com",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://www.instagram.com/dizitup",
      "https://www.linkedin.com/company/dizitup",
      "https://www.youtube.com/@dizitup-official"
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Service",
        "name": "Video Editing Services",
        "description": "Professional video editing for businesses, including short-form content, promos, and documentaries",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      },
      {
        "@type": "Service",
        "name": "Graphic Design Services",
        "description": "Creative graphic design including logos, branding, social media posts, and marketing materials",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      },
      {
        "@type": "Service",
        "name": "Website Development India",
        "description": "Responsive, SEO-optimized website development for startups and businesses in India",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      },
      {
        "@type": "Service",
        "name": "Workflow Automation",
        "description": "AI-powered business automation solutions to streamline operations and increase efficiency",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      },
      {
        "@type": "Service",
        "name": "App Development Services",
        "description": "Custom mobile and web application development from MVP to enterprise solutions",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      },
      {
        "@type": "Service",
        "name": "Branding & Strategy",
        "description": "Comprehensive branding and digital marketing strategy services for business growth",
        "provider": {
          "@type": "Organization",
          "name": "DizItUp"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
