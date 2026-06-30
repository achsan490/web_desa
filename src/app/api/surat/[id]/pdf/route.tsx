import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { LETTER_TYPES, formatDate } from "@/lib/utils";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 60,
    paddingRight: 60,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#000000",
  },
  kopContainer: {
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 8,
  },
  kopKecil: {
    fontSize: 12,
    textTransform: "uppercase",
    textAlign: "center",
  },
  kopBesar: {
    fontSize: 16,
    textTransform: "uppercase",
    textAlign: "center",
  },
  kopDetail: {
    fontSize: 9,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 2,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    textTransform: "uppercase",
    textDecoration: "underline",
  },
  ticketNumber: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: "Helvetica",
  },
  opening: {
    marginBottom: 12,
    textAlign: "justify",
    textIndent: 30,
  },
  table: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 140,
  },
  colon: {
    width: 15,
  },
  value: {
    flex: 1,
  },
  closing: {
    marginTop: 12,
    marginBottom: 40,
    textAlign: "justify",
    textIndent: 30,
  },
  signatureContainer: {
    alignItems: "flex-end",
    paddingRight: 20,
  },
  signatureBox: {
    width: 200,
    alignItems: "center",
  },
  dateText: {
    marginBottom: 5,
  },
  roleText: {
    marginBottom: 50,
  },
  nameText: {
    textDecoration: "underline",
  },
});

interface LetterRequestData {
  ticketNumber: string;
  type: string;
  applicantName: string;
  nik: string;
  birthPlace: string | null;
  birthDate: Date | null;
  address: string | null;
  purpose: string | null;
  createdAt: Date;
}

// Letter PDF Component
const MyLetterDocument = ({
  letter,
  kepalaName,
}: {
  letter: LetterRequestData;
  kepalaName: string;
}) => {
  const typeLabel = LETTER_TYPES.find((t: { value: string; label: string }) => t.value === letter.type)?.label || letter.type;
  
  const birthPlaceStr = letter.birthPlace || "-";
  const birthDateStr = letter.birthDate ? formatDate(letter.birthDate) : "-";
  const ttl = `${birthPlaceStr}, ${birthDateStr}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kop Surat */}
        <View style={styles.kopContainer}>
          <Text style={styles.kopKecil}>Pemerintah Kabupaten Jombang</Text>
          <Text style={styles.kopKecil}>Kecamatan Plandaan</Text>
          <Text style={styles.kopBesar}>Kantor Kepala Desa Pojok Klitih</Text>
          <Text style={styles.kopDetail}>
            Kantor Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang. Kode Pos 61456
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{typeLabel}</Text>
          <Text style={styles.ticketNumber}>Nomor Reg: {letter.ticketNumber}</Text>
        </View>

        {/* Opening */}
        <Text style={styles.opening}>
          Yang bertanda tangan di bawah ini, Kepala Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang, menerangkan dengan sebenarnya bahwa:
        </Text>

        {/* Table of Applicant Info */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{letter.applicantName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIK</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{letter.nik}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tempat / Tgl Lahir</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{ttl}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat Lengkap</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{letter.address || "-"}</Text>
          </View>
        </View>

        {/* Content detail */}
        <Text style={styles.opening}>
          Bahwa yang bersangkutan di atas adalah benar warga Desa Pojok Klitih yang bertempat tinggal di alamat tersebut. Surat keterangan ini diberikan atas permohonan yang bersangkutan untuk keperluan:
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Tujuan Keperluan</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{letter.purpose || "-"}</Text>
          </View>
        </View>

        {/* Closing */}
        <Text style={styles.closing}>
          Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya dan kepada pihak yang berkepentingan agar menjadi maklum.
        </Text>

        {/* Signature */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.dateText}>Pojok Klitih, {formatDate(new Date())}</Text>
            <Text style={styles.roleText}>Kepala Desa Pojok Klitih</Text>
            <Text style={styles.nameText}>{kepalaName}</Text>
            <Text style={{ fontSize: 10 }}>(Tanda Tangan & Cap Resmi)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch letter request from db
    const letter = await db.letterRequest.findUnique({
      where: { id },
    });

    if (!letter) {
      return new Response("Permohonan surat tidak ditemukan", { status: 404 });
    }

    // Fetch Kepala Desa name from profile
    const profile = await db.villageProfile.findFirst();
    const kepalaName = profile?.kepalaName || "H. Asep Irawan, S.IP";

    // Render to PDF buffer
    const pdfBuffer = await renderToBuffer(
      <MyLetterDocument letter={letter} kepalaName={kepalaName} />
    );

    // Return as PDF file response
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Surat_${letter.ticketNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Gagal membuat PDF", { status: 500 });
  }
}
