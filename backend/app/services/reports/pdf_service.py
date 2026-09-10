from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from typing import Dict, Any

class ClinicalPDFReportGenerator:
    """
    Generates official institutional competency and debrief reports using ReportLab.
    """

    @classmethod
    def generate_session_report(
        cls,
        session_id: str,
        student_name: str,
        case_title: str,
        evaluation_data: Dict[str, Any]
    ) -> bytes:
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#1e3a8a")
        )
        subtitle_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Heading3'],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#475569")
        )
        body_style = styles['Normal']

        story = []

        # Header
        story.append(Paragraph("AI Patient Simulation Engine — Clinical Evaluation Report", title_style))
        story.append(Paragraph(f"Case: {case_title}", subtitle_style))
        story.append(Spacer(1, 12))

        # Metadata Table
        status_text = "PASS" if evaluation_data.get("is_passed", False) else "NEEDS REMEDIATION"
        status_color = colors.HexColor("#15803d") if evaluation_data.get("is_passed", False) else colors.HexColor("#b91c1c")
        
        meta_data = [
            [Paragraph("<b>Student:</b>", body_style), Paragraph(student_name, body_style),
             Paragraph("<b>Session ID:</b>", body_style), Paragraph(str(session_id)[:8], body_style)],
            [Paragraph("<b>Final Score:</b>", body_style), Paragraph(f"<b>{evaluation_data.get('total_score', 0)}%</b>", body_style),
             Paragraph("<b>Outcome:</b>", body_style), Paragraph(f"<font color='{status_color.hexval()}'><b>{status_text}</b></font>", body_style)]
        ]
        meta_table = Table(meta_data, colWidths=[80, 180, 80, 180])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 14))

        # Competency Breakdown
        story.append(Paragraph("<b>Competency Breakdown</b>", styles['Heading2']))
        story.append(Spacer(1, 6))

        breakdown = evaluation_data.get("score_breakdown", {})
        table_data = [
            ["Clinical Competency", "Score Achieved", "Benchmark Target"],
            ["History Taking & Communication", f"{breakdown.get('history', 0)}%", "75%"],
            ["Investigation Selection & Justification", f"{breakdown.get('investigations', 0)}%", "80%"],
            ["Initial Management & Resuscitation", f"{breakdown.get('treatment', 0)}%", "80%"],
            ["Clinical Reasoning & Diagnosis", f"{breakdown.get('diagnosis', 0)}%", "85%"]
        ]
        score_table = Table(table_data, colWidths=[240, 140, 140])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(score_table)
        story.append(Spacer(1, 14))

        # Strengths & Learning Points
        story.append(Paragraph("<b>Clinical Feedback & Key Observations</b>", styles['Heading2']))
        story.append(Spacer(1, 6))
        
        strengths = evaluation_data.get("strengths", [])
        if strengths:
            story.append(Paragraph("<b>Demonstrated Strengths:</b>", body_style))
            for s in strengths:
                story.append(Paragraph(f"• {s}", body_style))
            story.append(Spacer(1, 6))

        growth = evaluation_data.get("areas_for_growth", [])
        if growth:
            story.append(Paragraph("<b>Actionable Learning Points:</b>", body_style))
            for g in growth:
                story.append(Paragraph(f"• {g}", body_style))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
