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