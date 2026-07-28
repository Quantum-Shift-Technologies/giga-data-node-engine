export const openapiSpecification = {
    openapi: "3.0.3",
    info: {
        title: "GigaData Engine REST & AI API",
        version: "1.0.0",
        description: "Sovereign Agronomic Data Infrastructure API serving geo-boundaries, yield logs, pathology diagnostics, and crop cut datasets.",
    },
    servers: [
        {
            url: "/",
        },
    ],
    tags: [
        { name: "Health" },
        { name: "Datasets" },
        { name: "Map Geometry" },
        { name: "Commercial Licensing" },
        { name: "AI Services" },
    ],
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Health Check",
                description: "Retrieve service health status.",
                responses: {
                    200: {
                        description: "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: { type: "string", example: "ok" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/datasets": {
            get: {
                tags: ["Datasets"],
                summary: "Get All Datasets",
                description: "Retrieves a summary registry list of all sovereign agronomic datasets available.",
                responses: {
                    200: {
                        description: "List of datasets fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/DatasetSummary"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Details",
                description: "Retrieves metadata of a specific dataset by its ID.",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset metadata retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DatasetSummary"
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset not found"
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}/schema": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Schema",
                description: "Retrieves column definition, constraints, and descriptions mapping this dataset.",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset schema retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        dataset_id: { type: "string", example: "maize_yield_surveys" },
                                        columns: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/ColumnSchema"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset schema not found"
                    }
                }
            }
        },
        "/api/v1/datasets/{dataset_id}/sample": {
            get: {
                tags: ["Datasets"],
                summary: "Get Dataset Sample Preview",
                description: "Retrieves mock spreadsheet rows for browser grid preview.",
                parameters: [
                    {
                        name: "dataset_id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Unique identifier of the dataset"
                    }
                ],
                responses: {
                    200: {
                        description: "Dataset sample rows retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "Dataset sample not found"
                    }
                }
            }
        },
        "/api/v1/map/boundaries": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get Spatial Boundaries",
                description: "Fetches generalised GeoJSON feature coordinates tracing agricultural zones in Zimbabwe.",
                responses: {
                    200: {
                        description: "GeoJSON FeatureCollection representing district boundaries",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        type: { type: "string", example: "FeatureCollection" },
                                        features: {
                                            type: "array",
                                            items: {
                                                type: "object"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/map/timeline": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get Map Explorer Timeline",
                description: "Returns Ndvi, active reporting nodes, and weather statistics over historical timeslots.",
                responses: {
                    200: {
                        description: "Map timeline stats",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        dates: {
                                            type: "array",
                                            items: { type: "string" },
                                            example: ["April 2024", "August 2024", "Today"]
                                        },
                                        metrics_by_month: {
                                            type: "object"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/map/districts/{name}": {
            get: {
                tags: ["Map Geometry"],
                summary: "Get District Yield Details",
                description: "Returns agronomic summary Gdd, crop classification, coordinates, and average yield logs for specific districts.",
                parameters: [
                    {
                        name: "name",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "District identifier name (e.g. Bindura, Mutoko)"
                    }
                ],
                responses: {
                    200: {
                        description: "District information retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", example: "Mutoko" },
                                        province: { type: "string", example: "Mashonaland East" },
                                        avg_yield: { type: "string", example: "4.35 t/ha" },
                                        dominant_crop: { type: "string", example: "Maize (SC 513)" }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: "District not found"
                    }
                }
            }
        },
        "/api/v1/access-requests": {
            post: {
                tags: ["Commercial Licensing"],
                summary: "Submit Access Request",
                description: "Submit request to provision programmatic API access keys.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AccessRequest"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Access request registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AccessRequestResponse"
                                }
                            }
                        }
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            },
            get: {
                tags: ["Commercial Licensing"],
                summary: "Get Access Requests History",
                description: "Auditing history logs of registered access licensing entries.",
                responses: {
                    200: {
                        description: "List of access requests",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/AccessRequestResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/v1/chatbot/query": {
            post: {
                tags: ["AI Services"],
                summary: "Query AI Agronomy Assistant",
                description: "Sends context prompt to query verified agronomy bulletins.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["message"],
                                properties: {
                                    message: { type: "string", example: "Maize streak virus symptoms" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Chatbot answers retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        text: { type: "string" },
                                        source_documents: {
                                            type: "array",
                                            items: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    422: {
                        description: "Validation error"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            DatasetSummary: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    emoji: { type: "string" },
                    description: { type: "string" },
                    creator: { type: "string" },
                    license: { type: "string" },
                    downloads: { type: "integer" },
                    votes: { type: "integer" },
                    size: { type: "string" },
                    format: { type: "string" },
                    last_updated: { type: "string" },
                    tier: { type: "string" },
                    coverage: { type: "string" },
                    resolution: { type: "string" },
                    records: { type: "integer" }
                }
            },
            ColumnSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    data_type: { type: "string" },
                    description: { type: "string" },
                    nullable: { type: "boolean" },
                    constraints: { type: "string", nullable: true }
                }
            },
            AccessRequest: {
                type: "object",
                required: ["organization", "use_case", "project_description", "plan_selected"],
                properties: {
                    organization: { type: "string", minLength: 2 },
                    use_case: { type: "string" },
                    project_description: { type: "string", minLength: 10 },
                    plan_selected: { type: "string" }
                }
            },
            AccessRequestResponse: {
                type: "object",
                properties: {
                    request_id: { type: "string" },
                    organization: { type: "string" },
                    plan_selected: { type: "string" },
                    status: { type: "string" },
                    message: { type: "string" },
                    submission_timestamp: { type: "string" }
                }
            }
        }
    }
};
