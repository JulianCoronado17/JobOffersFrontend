const mockOffers = [
    {
        id: "1",
        title: "Desarrollador de Inteligencia Artificial Senior",
        zone: "Bogotá, D.C.",
        mode: "Híbrido (3 días presencial)",
        moreInfo: {
            price: 5000000,
            InfoAditional: "Contrato a término fijo 12 meses",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido",
            titleDescription: "Requisitos principales",
            Description: `5+ años de experiencia en desarrollo de software con Python. Experiencia con TensorFlow, PyTorch y transformers. Conocimiento avanzado en fine-tuning de LLMs y arquitecturas de redes neuronales. Experiencia en despliegue de modelos en producción usando Docker y Kubernetes.`
        }
    },
    {
        id: "2",
        title: "Ingeniero de Datos",
        zone: "Medellín, Antioquia",
        mode: "Remoto",
        moreInfo: {
            price: 4500000,
            InfoAditional: "Contrato indefinido",
            Time: "Tiempo Completo",
            WorkFrom: "100% Remoto",
            titleDescription: "Responsabilidades",
            Description: `Diseñar y mantener pipelines de datos en AWS. Experiencia con Spark, Airflow y SQL avanzado. Conocimiento en data lakes y warehouses. Optimizar consultas para grandes volúmenes de datos. Implementar soluciones ETL/ELT.`
        }
    },
    {
        id: "3",
        title: "Frontend Developer (React)",
        zone: "Cali, Valle del Cauca",
        mode: "Presencial",
        moreInfo: {
            price: 3500000,
            InfoAditional: "Contrato por prestación de servicios",
            Time: "Medio Tiempo",
            WorkFrom: "Oficina",
            titleDescription: "Habilidades requeridas",
            Description: `3+ años con React.js, TypeScript y Redux. Experiencia en desarrollo de componentes reutilizables. Conocimiento de patrones de diseño frontend. Experiencia con testing (Jest, React Testing Library). Trabajo con APIs REST y GraphQL.`
        }
    },
    {
        id: "4",
        title: "DevOps Engineer",
        zone: "Barranquilla, Atlántico",
        mode: "Híbrido",
        moreInfo: {
            price: 6000000,
            InfoAditional: "Contrato indefinido",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido (2 días remoto)",
            titleDescription: "Tecnologías clave",
            Description: `Experiencia con AWS/GCP, Terraform, Ansible. Configuración de CI/CD (GitHub Actions, Jenkins). Monitorización (Prometheus, Grafana). Conocimiento en Kubernetes y Docker. Automatización de infraestructura cloud. Seguridad en la nube.`
        }
    },
    {
        id: "5",
        title: "Product Manager Digital",
        zone: "Bucaramanga, Santander",
        mode: "Remoto parcial",
        moreInfo: {
            price: 5500000,
            InfoAditional: "Contrato a término indefinido",
            Time: "Tiempo Completo",
            WorkFrom: "80% Remoto",
            titleDescription: "Funciones principales",
            Description: `Definir roadmap de producto. Priorizar features basado en métricas. Trabajar con equipos cross-funcionales. Experiencia con Agile/Scrum. Análisis de mercado y competencia. Definición de KPIs y seguimiento.`
        }
    },
    {
        id: "6",
        title: "Cybersecurity Specialist",
        zone: "Pereira, Risaralda",
        mode: "Remoto",
        moreInfo: {
            price: 6500000,
            InfoAditional: "Contrato por obra o labor",
            Time: "Tiempo Completo",
            WorkFrom: "100% Remoto",
            titleDescription: "Competencias técnicas",
            Description: `Experiencia en pentesting y ethical hacking. Conocimiento de frameworks de seguridad (NIST, ISO 27001). Análisis de vulnerabilidades. Configuración de firewalls y SIEM. Respuesta a incidentes. Certificaciones como CISSP o CEH son plus.`
        }
    },
    {
        id: "7",
        title: "Mobile Developer (Flutter)",
        zone: "Cartagena, Bolívar",
        mode: "Presencial",
        moreInfo: {
            price: 4000000,
            InfoAditional: "Contrato de aprendizaje",
            Time: "Tiempo Completo",
            WorkFrom: "Oficina",
            titleDescription: "Requisitos técnicos",
            Description: `2+ años con Flutter y Dart. Publicación de apps en stores. Conocimiento de BLoC pattern. Integración con APIs REST. Experiencia con Firebase. Diseño de UI responsive. Conocimiento de widgets nativos.`
        }
    },
    {
        id: "8",
        title: "Data Scientist",
        zone: "Manizales, Caldas",
        mode: "Híbrido",
        moreInfo: {
            price: 5800000,
            InfoAditional: "Contrato temporal 6 meses",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido (3 días remoto)",
            titleDescription: "Habilidades clave",
            Description: `Python avanzado (pandas, NumPy, scikit-learn). Machine Learning supervisado y no supervisado. Procesamiento de lenguaje natural (NLTK, spaCy). Visualización de datos (Matplotlib, Seaborn). SQL avanzado. Experimentación y análisis estadístico.`
        }
    },
    {
        id: "9",
        title: "UX/UI Designer Senior",
        zone: "Bogotá, D.C.",
        mode: "Híbrido flexible",
        moreInfo: {
            price: 4800000,
            InfoAditional: "Contrato indefinido con periodo de prueba",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido (1-2 días presencial)",
            titleDescription: "Requisitos",
            Description: `Portafolio demostrable. 5+ años en diseño de interfaces. Experiencia con Figma, Adobe XD y prototipado. Conocimiento de sistemas de diseño. Investigación de usuarios y testing. Trabajo con desarrolladores en implementación. Experiencia en agile.`
        }
    },
    {
        id: "10",
        title: "Backend Developer (Node.js)",
        zone: "Remoto",
        mode: "Remoto",
        moreInfo: {
            price: 5200000,
            InfoAditional: "Contrato por prestación internacional",
            Time: "Tiempo Completo",
            WorkFrom: "100% Remoto (equipo global)",
            titleDescription: "Tecnologías",
            Description: `Node.js avanzado con TypeScript. Arquitectura de microservicios. Bases de datos SQL/NoSQL. AWS Lambda y serverless. Mensajería (Kafka, RabbitMQ). Patrones de diseño backend. Seguridad aplicativa (OWASP). Experiencia en alta escalabilidad.`
        }
    },
    {
        id: "11",
        title: "Cloud Architect",
        zone: "Medellín, Antioquia",
        mode: "Remoto parcial",
        moreInfo: {
            price: 7500000,
            InfoAditional: "Contrato indefinido con beneficios",
            Time: "Tiempo Completo",
            WorkFrom: "80% Remoto",
            titleDescription: "Responsabilidades clave",
            Description: `Diseñar arquitecturas cloud (AWS/Azure). Estrategias de migración. Optimización de costos. Gobierno y seguridad cloud. Certificaciones AWS/Azure. Infraestructura como código. Liderar equipos técnicos. Planes de disaster recovery.`
        }
    },
    {
        id: "12",
        title: "Tech Lead Java",
        zone: "Cali, Valle del Cauca",
        mode: "Presencial flexible",
        moreInfo: {
            price: 6800000,
            InfoAditional: "Contrato indefinido con stock options",
            Time: "Tiempo Completo",
            WorkFrom: "Presencial flexible (3 días)",
            titleDescription: "Perfil buscado",
            Description: `8+ años con Java/Spring Boot. Liderazgo técnico de equipos. Arquitectura de sistemas distribuidos. Patrones de diseño. Microservicios y Kubernetes. Metodologías ágiles. Toma de decisiones técnicas. Mentoring de desarrolladores.`
        }
    },
    {
        id: "13",
        title: "QA Automation Engineer",
        zone: "Bucaramanga, Santander",
        mode: "Híbrido",
        moreInfo: {
            price: 4200000,
            InfoAditional: "Contrato a término fijo 6 meses",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido (2 días remoto)",
            titleDescription: "Habilidades técnicas",
            Description: `Automatización con Selenium/Cypress. Pruebas de API (Postman, RestAssured). Frameworks BDD. Integración en CI/CD. Programación en Java/Python. Pruebas de carga (JMeter). Gestión de defectos (JIRA). Conocimiento en DevOps.`
        }
    },
    {
        id: "14",
        title: "Scrum Master",
        zone: "Barranquilla, Atlántico",
        mode: "Remoto",
        moreInfo: {
            price: 5300000,
            InfoAditional: "Contrato por servicios profesionales",
            Time: "Tiempo Completo",
            WorkFrom: "100% Remoto",
            titleDescription: "Funciones",
            Description: `Certificación Scrum. Facilitación de ceremonias. Remoción de impedimentos. Métricas ágiles (velocity, burndown). Coaching a equipos. Trabajo con Product Owners. Mejora continua de procesos. Experiencia con scaled frameworks (SAFe, LeSS).`
        }
    },
    {
        id: "15",
        title: "Blockchain Developer",
        zone: "Remoto Latam",
        mode: "Remoto",
        moreInfo: {
            price: 7000000,
            InfoAditional: "Contrato en cripto (opcional)",
            Time: "Tiempo Completo",
            WorkFrom: "100% Remoto",
            titleDescription: "Conocimientos requeridos",
            Description: `Solidity avanzado. Desarrollo de smart contracts. Arquitecturas DeFi. Ethereum y Layer 2. Seguridad blockchain. Web3.js/ethers.js. Tokens (ERC-20, ERC-721). Experiencia en auditorías. Conocimiento de oráculos.`
        }
    },
    {
        id: "16",
        title: "SRE Engineer",
        zone: "Bogotá, D.C.",
        mode: "Híbrido premium",
        moreInfo: {
            price: 7200000,
            InfoAditional: "Paquete completo de beneficios",
            Time: "Tiempo Completo",
            WorkFrom: "Híbrido (1 día presencial)",
            titleDescription: "Tecnologías",
            Description: `Observabilidad (Datadog, New Relic). Infraestructura como código. Kubernetes en producción. SLA/SLO management. Automatización con Python/Go. On-call rotation. Chaos engineering. Cloud networking avanzado.`
        }
    }
];

export const GetAllOffers = async() => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve ({data:mockOffers});
        }, 500);
    });
};

export const GetBasicOffers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const basicData = mockOffers.map(({ title, zone, mode }) => ({
                title,
                zone,
                mode
            }));
            resolve({ data: basicData });
        }, 500);
    });
};

export const getPaginatedOffers = async (options = {}) => {
    const {
      page = 1,
      pageSize = 4,
      sortBy = null,
      sortOrder = 'asc',
      filters = {}
    } = options;
  
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockOffers];
        
        if (Object.keys(filters).length > 0) {
          filteredData = filteredData.filter(offer => {
            return Object.entries(filters).every(([key, value]) => {
              if (key.includes('.')) {
                const [parentKey, childKey] = key.split('.');
                return offer[parentKey] && 
                       String(offer[parentKey][childKey]).toLowerCase().includes(String(value).toLowerCase());
              }
              return String(offer[key]).toLowerCase().includes(String(value).toLowerCase());
            });
          });
        }
  
        if (sortBy) {
          filteredData.sort((a, b) => {
            let valueA, valueB;
            
            if (sortBy.includes('.')) {
              const [parentKey, childKey] = sortBy.split('.');
              valueA = a[parentKey] ? a[parentKey][childKey] : null;
              valueB = b[parentKey] ? b[parentKey][childKey] : null;
            } else {
              valueA = a[sortBy];
              valueB = b[sortBy];
            }
  
            if (typeof valueA === 'string' && typeof valueB === 'string') {
              return sortOrder === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            } else {
              return sortOrder === 'asc' 
                ? valueA - valueB 
                : valueB - valueA;
            }
          });
        }
  
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        
        const paginatedItems = filteredData.slice(startIndex, endIndex);
  
        resolve({
          data: paginatedItems,
          pagination: {
            page,
            pageSize,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        });
      }, 500);
    });
  };
  

  export const searchOffers = async (searchTerm, paginationOptions = {}) => {
    if (!searchTerm) {
      return getPaginatedOffers(paginationOptions);
    }
  
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTermLower = searchTerm.toLowerCase();
        
        const searchResults = mockOffers.filter(offer => {
          return (
            offer.title.toLowerCase().includes(searchTermLower) ||
            offer.zone.toLowerCase().includes(searchTermLower) ||
            offer.mode.toLowerCase().includes(searchTermLower) ||
            offer.moreInfo.Description.toLowerCase().includes(searchTermLower)
          );
        });
  
        const { page = 1, pageSize = 3 } = paginationOptions;
        const totalItems = searchResults.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        
        resolve({
          data: searchResults.slice(startIndex, endIndex),
          pagination: {
            page,
            pageSize,
            totalPages,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        });
      }, 600);
    });
  };