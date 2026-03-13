import { ImageResponse } from "next/og"
import { getProjectData, getProjectSlugs } from "@/lib/content"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  const slugs = getProjectSlugs()
  return slugs.map((slug) => ({ slug: encodeURIComponent(slug) }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectData(decodeURIComponent(slug))

  const title = project?.title ?? "Projet"
  const type = Array.isArray(project?.project_type)
    ? project.project_type.join(" · ")
    : project?.project_type ?? ""
  const context = project?.annonceur
    ? `${project.annonceur} — ${project.contexte}`
    : project?.contexte ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0d1b38 0%, #1a2f5a 60%, #0d1b38 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #c45880, #f4acc6, #c45880)",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              color: "#c45880",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            CORENTIN BASSON
          </div>
          {type ? (
            <div
              style={{
                background: "rgba(196, 88, 128, 0.2)",
                border: "1px solid rgba(196, 88, 128, 0.5)",
                color: "#f4acc6",
                fontSize: "14px",
                padding: "6px 16px",
                borderRadius: "999px",
                display: "flex",
              }}
            >
              {type}
            </div>
          ) : null}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 40 ? "52px" : "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          {context ? (
            <div
              style={{
                color: "#94a3b8",
                fontSize: "22px",
                marginTop: "16px",
                display: "flex",
              }}
            >
              {context}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ color: "#64748b", fontSize: "16px", display: "flex" }}>
            cbsn-pics.com/projects
          </div>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(196, 88, 128, 0.15)",
              border: "1px solid rgba(196, 88, 128, 0.4)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c45880",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            CB
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #c45880, #f4acc6, #c45880)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
