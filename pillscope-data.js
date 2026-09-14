// PillScope — combined local data + live API sources
// (Merged from data.js + api.js to cut down on file count)
//
// SECTION 1: Offline sample medicine data
// This array is ONLY used as a last-resort fallback (e.g. the user is
// offline, or every live API call failed) and for the curated "Browse by
// category" grid on the homepage. It is NOT what search results come
// from — see SECTION 2 for that. Replace or extend this array with real
// data whenever you're ready.

const MEDICINES = [
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    generic: "Ibuprofen",
    brand: ["Advil", "Motrin"],
    category: "Pain Relief",
    form: "Tablet",
    strength: "200 mg",
    description:
      "A nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and relieve mild to moderate pain, including headaches, muscle aches, and menstrual cramps.",
    dosage: "1 tablet (200 mg) every 4–6 hours as needed. Do not exceed 6 tablets in 24 hours.",
    sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Mild headache"],
    warnings:
      "Avoid on an empty stomach. Long-term use may increase risk of stomach bleeding and affect kidney function.",
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    generic: "Amoxicillin",
    brand: ["Amoxil"],
    category: "Antibiotic",
    form: "Capsule",
    strength: "500 mg",
    description:
      "A penicillin-type antibiotic used to treat a wide range of bacterial infections, including ear, throat, and respiratory infections.",
    dosage: "1 capsule (500 mg) every 8 hours for 7–10 days, or as prescribed.",
    sideEffects: ["Nausea", "Diarrhea", "Rash", "Yeast infection"],
    warnings:
      "Complete the full course even if symptoms improve. Not effective against viral infections.",
  },
  {
    id: "loratadine",
    name: "Loratadine",
    generic: "Loratadine",
    brand: ["Claritin"],
    category: "Allergy",
    form: "Tablet",
    strength: "10 mg",
    description:
      "A non-drowsy antihistamine used to relieve allergy symptoms such as sneezing, runny nose, and itchy eyes.",
    dosage: "1 tablet (10 mg) once daily.",
    sideEffects: ["Dry mouth", "Mild fatigue", "Headache"],
    warnings: "Use caution with liver impairment; dosage may need adjustment.",
  },
  {
    id: "metformin",
    name: "Metformin",
    generic: "Metformin hydrochloride",
    brand: ["Glucophage"],
    category: "Diabetes",
    form: "Tablet",
    strength: "500 mg",
    description:
      "A first-line oral medication for type 2 diabetes that helps control blood sugar by improving insulin sensitivity.",
    dosage: "1 tablet (500 mg) with meals, up to twice daily, or as prescribed.",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Loss of appetite"],
    warnings:
      "Rare risk of lactic acidosis. Inform your doctor before contrast imaging procedures.",
  },
  {
    id: "omeprazole",
    name: "Omeprazole",
    generic: "Omeprazole",
    brand: ["Prilosec"],
    category: "Digestive",
    form: "Capsule",
    strength: "20 mg",
    description:
      "A proton pump inhibitor that reduces stomach acid production, used for acid reflux, heartburn, and ulcers.",
    dosage: "1 capsule (20 mg) once daily before breakfast.",
    sideEffects: ["Headache", "Abdominal pain", "Gas", "Nausea"],
    warnings: "Long-term use may affect vitamin B12 and magnesium absorption.",
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    generic: "Atorvastatin calcium",
    brand: ["Lipitor"],
    category: "Cardiovascular",
    form: "Tablet",
    strength: "10 mg",
    description:
      "A statin medication that lowers LDL cholesterol and reduces the risk of heart attack and stroke.",
    dosage: "1 tablet (10 mg) once daily, usually in the evening.",
    sideEffects: ["Muscle aches", "Joint pain", "Mild digestive upset"],
    warnings: "Report unexplained muscle pain or weakness to your doctor immediately.",
  },
  {
    id: "cetirizine",
    name: "Cetirizine",
    generic: "Cetirizine hydrochloride",
    brand: ["Zyrtec"],
    category: "Allergy",
    form: "Tablet",
    strength: "10 mg",
    description:
      "An antihistamine used to relieve symptoms of hay fever, hives, and other allergic reactions.",
    dosage: "1 tablet (10 mg) once daily.",
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    warnings: "May cause drowsiness; use caution when driving or operating machinery.",
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    generic: "Acetaminophen",
    brand: ["Tylenol", "Panadol"],
    category: "Pain Relief",
    form: "Tablet",
    strength: "500 mg",
    description:
      "A common pain reliever and fever reducer, gentler on the stomach than NSAIDs like ibuprofen.",
    dosage: "1–2 tablets (500–1000 mg) every 4–6 hours. Do not exceed 4000 mg in 24 hours.",
    sideEffects: ["Rare at normal doses", "Nausea (uncommon)"],
    warnings: "Overdose can cause serious liver damage. Avoid combining with other acetaminophen products.",
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    generic: "Azithromycin",
    brand: ["Zithromax"],
    category: "Antibiotic",
    form: "Tablet",
    strength: "250 mg",
    description:
      "A macrolide antibiotic used to treat respiratory infections, skin infections, and certain sexually transmitted infections.",
    dosage: "500 mg on day 1, then 250 mg once daily for 4 more days, or as prescribed.",
    sideEffects: ["Diarrhea", "Nausea", "Abdominal pain"],
    warnings: "May interact with heart rhythm medications. Take on an empty stomach for best absorption.",
  },
  {
    id: "salbutamol",
    name: "Salbutamol",
    generic: "Albuterol sulfate",
    brand: ["Ventolin"],
    category: "Respiratory",
    form: "Inhaler",
    strength: "100 mcg/puff",
    description:
      "A fast-acting bronchodilator inhaler used to relieve asthma symptoms and sudden breathing difficulty.",
    dosage: "1–2 puffs as needed for symptom relief, or as prescribed for asthma control.",
    sideEffects: ["Tremor", "Rapid heartbeat", "Nervousness", "Headache"],
    warnings: "Overuse may indicate poorly controlled asthma — consult your doctor.",
  },
  {
    id: "losartan",
    name: "Losartan",
    generic: "Losartan potassium",
    brand: ["Cozaar"],
    category: "Cardiovascular",
    form: "Tablet",
    strength: "50 mg",
    description:
      "An angiotensin receptor blocker (ARB) used to treat high blood pressure and protect kidney function in diabetics.",
    dosage: "1 tablet (50 mg) once daily.",
    sideEffects: ["Dizziness", "Fatigue", "Elevated potassium levels"],
    warnings: "Avoid during pregnancy. Monitor potassium and kidney function periodically.",
  },
  {
    id: "melatonin",
    name: "Melatonin",
    generic: "Melatonin",
    brand: ["Various"],
    category: "Sleep",
    form: "Tablet",
    strength: "5 mg",
    description:
      "A hormone supplement used to help regulate sleep cycles and manage occasional insomnia or jet lag.",
    dosage: "1 tablet (5 mg) 30–60 minutes before bedtime.",
    sideEffects: ["Drowsiness", "Mild headache", "Vivid dreams"],
    warnings: "Not intended for long-term nightly use without medical guidance.",
  },
];

// Category → accent color mapping (from the PillScope palette)
const CATEGORY_COLORS = {
  "Pain Relief": "#A1F00F",
  "Antibiotic": "#B5CADF",
  "Allergy": "#B5F9CD",
  "Diabetes": "#BBF451",
  "Digestive": "#E5FBBC",
  "Cardiovascular": "#C8F665",
  "Respiratory": "#AEE8F0",
  "Sleep": "#DEDEDE",
};

// SECTION 2: Live data sources
//
// Trusted, free, public APIs used here — every one of these is keyless
// or works fine with a free/instant signup:
//
//   RxNorm (NIH / U.S. National Library of Medicine)
//     https://rxnav.nlm.nih.gov/REST/  — no key required
//     Name autocomplete, RxCUI (the standardized drug identifier).
//
//   RxClass (NIH / NLM, same family as RxNorm)
//     https://rxnav.nlm.nih.gov/REST/rxclass/  — no key required
//     ATC classification for a given RxCUI.
//
//   openFDA (U.S. FDA / HHS)
//     https://api.fda.gov/  — free key used below for higher rate limits
//     Full drug labels (drug/label) AND the NDC Directory (drug/ndc) —
//     this is the "whole industry" source: every FDA-approved drug
//     product sold in the US, not just a hand-picked 12/14.
//
//   DailyMed (NIH / NLM) — fallback when openFDA has no label
//     https://dailymed.nlm.nih.gov/dailymed/services/v2/  — no key required
//
//   PubChem PUG REST (NIH / NLM)
//     https://pubchem.ncbi.nlm.nih.gov/rest/pug/  — no key required
//     Used here only to pull the CAS Registry Number, which isn't a field
//     FDA/RxNorm expose directly — PubChem lists it as a "synonym" of the
//     compound, so we search synonyms for something shaped like a CAS
//     number (##-##-# pattern).
//
//   Wikidata (Wikimedia Foundation)
//     https://www.wikidata.org/w/api.php  — no key required
//     Fallback photo source (property P18) for the rarer case where
//     DailyMed has no image for a product.
//
//   DailyMed images — the PRIMARY photo source. Each DailyMed label
//   (identified by a "setid") can have real package/label photos
//   attached — see /spls/{setid}/media.json. openFDA's NDC Directory
//   entries include that same setid directly as `spl_id`, and openFDA
//   labels include it as `openfda.spl_id`, so most of the time we don't
//   even need an extra name search to find it.
//
// NOTE: this is a static site with no backend, so the key below is visible
// to anyone who views page source or the GitHub repo. That's an accepted
// trade-off for openFDA specifically: the key only raises YOUR rate limit
// (roughly 1,000/day -> 120,000/day) and doesn't unlock anything private.
// If you ever add a build step, serverless function, or Cloudflare Worker,
// move the key server-side instead of shipping it in client JS.

const OPENFDA_API_KEY = "hsJ7XiXJrM4NyykxIQubnmQgTe7DMRvzKVvvpGgN";

const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";
const RXCLASS_BASE = "https://rxnav.nlm.nih.gov/REST/rxclass";
const OPENFDA_BASE = "https://api.fda.gov";
const DAILYMED_BASE = "https://dailymed.nlm.nih.gov/dailymed/services/v2";
const PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const WIKIDATA_BASE = "https://www.wikidata.org/w/api.php";
const COMMONS_FILE_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const PillAPI = (() => {
  const cache = new Map();

  async function safeJson(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`Request failed: ${res.status} for ${url}`);
    return res.json();
  }

  function pick(arr) {
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  }

  function truncate(text, max = 600) {
    if (!text) return null;
    return text.length > max ? text.slice(0, max).trim() + "…" : text;
  }

  function slugify(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function cached(key, fn) {
    if (cache.has(key)) return cache.get(key);
    const value = await fn();
    cache.set(key, value);
    return value;
  }

  // ==================================================================
  // Identifier detection — lets one search box accept a name, an NDC,
  // an RxCUI, a CAS number, or an ATC code, and route to the right
  // lookup automatically.
  // ==================================================================
  function detectIdentifier(raw) {
    const q = raw.trim();

    // NDC: "12345-678-90" style, or 10-11 raw digits (with or without
    // dashes in one of the standard 4-4-2 / 5-3-2 / 5-4-1 / 5-4-2 segment
    // layouts). We normalize to digits-only and let getByNDC try the
    // common segmentations against openFDA.
    if (/^\d{4,5}-\d{3,4}-\d{1,2}$/.test(q)) return { type: "ndc", value: q };
    if (/^\d{10,11}$/.test(q)) return { type: "ndc", value: q };

    // CAS Registry Number: ##(#...)-##-# — 2 to 7 digits, dash, 2 digits,
    // dash, 1 check digit. Distinct from NDC because the last group is
    // always exactly 1 digit.
    if (/^\d{2,7}-\d{2}-\d$/.test(q)) return { type: "cas", value: q };

    // ATC code: 1 letter, 2 digits, then optionally 2 letters + 2 digits
    // more, e.g. "C09AA01" (full) or "C09" (just the class).
    if (/^[A-Za-z]\d{2}([A-Za-z]{2}(\d{2})?)?$/.test(q)) return { type: "atc", value: q.toUpperCase() };

    // RxCUI: plain integer, typically 1-7 digits, with no dashes at all
    // (so it doesn't collide with the NDC digit-string case above, which
    // requires 10-11 digits).
    if (/^\d{1,7}$/.test(q)) return { type: "rxcui", value: q };

    return { type: "name", value: q };
  }

  // ==================================================================
  // RxNorm: name suggestions while typing
  // ==================================================================
  async function suggestNames(query, max = 6) {
    const q = query.trim();
    if (q.length < 2) return [];

    return cached(`sugg:${q.toLowerCase()}`, async () => {
      const names = [];
      const seen = new Set();

      function addName(name) {
        if (name && names.length < max && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          names.push(name);
        }
      }

      try {
        const url = `${RXNORM_BASE}/drugs.json?name=${encodeURIComponent(q)}`;
        const data = await safeJson(url);
        const groups = data?.drugGroup?.conceptGroup || [];
        outer: for (const group of groups) {
          for (const concept of group.conceptProperties || []) {
            addName(concept.name);
            if (names.length >= max) break outer;
          }
        }
      } catch (err) {
        console.warn("RxNorm exact search failed:", err);
      }

      if (names.length < max) {
        try {
          const url = `${RXNORM_BASE}/approximateTerm.json?term=${encodeURIComponent(q)}&maxEntries=${max}`;
          const data = await safeJson(url);
          const candidates = (data?.approximateGroup?.candidate || [])
            .map((c) => c.rxcui)
            .filter(Boolean);

          for (const rxcui of candidates) {
            if (names.length >= max) break;
            try {
              const nameUrl = `${RXNORM_BASE}/rxcui/${rxcui}/property.json?propName=RxNorm%20Name`;
              const nameData = await safeJson(nameUrl);
              addName(nameData?.propConceptGroup?.propConcept?.[0]?.propValue);
            } catch (_) {
              // skip individual lookup failures, keep going
            }
          }
        } catch (err) {
          console.warn("RxNorm approximate search failed:", err);
        }
      }

      return names;
    });
  }

  // ==================================================================
  // openFDA: broad multi-result search across the FULL label database —
  // this is what replaces the old "only 12 local medicines" behavior.
  // Matches brand name, generic name, and active-substance name, each as
  // a prefix match, so "amox" finds "Amoxicillin", "Amoxil", etc.
  // ==================================================================
  async function searchLabels(query, limit = 24) {
    const q = query.trim();
    if (!q) return [];

    return cached(`labels:${q.toLowerCase()}:${limit}`, async () => {
      const esc = q.replace(/"/g, '\\"');
      const search =
        `(openfda.brand_name:"${esc}"* OR openfda.generic_name:"${esc}"* ` +
        `OR openfda.substance_name:"${esc}"*)`;
      const url =
        `${OPENFDA_BASE}/drug/label.json?search=${encodeURIComponent(search)}` +
        `&limit=${limit}&api_key=${OPENFDA_API_KEY}`;

      try {
        const data = await safeJson(url);
        const results = data?.results || [];
        // De-dupe by brand/generic name — the label endpoint can return
        // multiple label revisions for the same product.
        const seen = new Set();
        const out = [];
        for (const label of results) {
          const norm = normalizeFdaResult(label, q);
          const key = norm.name.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(norm);
        }
        return out;
      } catch (err) {
        console.warn("openFDA broad search failed:", err);
        return [];
      }
    });
  }

  // ---------- openFDA: single-name label lookup (detail page) ----------
  async function fetchLabel(name) {
    return cached(`fda:${name.toLowerCase()}`, async () => {
      const url = `${OPENFDA_BASE}/drug/label.json?search=${encodeURIComponent(
        `openfda.brand_name:"${name}" OR openfda.generic_name:"${name}"`
      )}&limit=1&api_key=${OPENFDA_API_KEY}`;

      try {
        const data = await safeJson(url);
        return data?.results?.[0] || null;
      } catch (err) {
        console.warn("openFDA lookup failed:", err);
        return null;
      }
    });
  }

  // ---------- DailyMed: fallback when openFDA has nothing ----------
  async function fetchDailyMed(name) {
    const url = `${DAILYMED_BASE}/spls.json?drug_name=${encodeURIComponent(name)}&page_size=1`;
    try {
      const data = await safeJson(url);
      return data?.data?.[0] || null;
    } catch (err) {
      console.warn("DailyMed lookup failed:", err);
      return null;
    }
  }

  // ==================================================================
  // openFDA NDC Directory — product-level lookup by National Drug Code.
  // Accepts loosely-formatted input and tries the standard NDC segment
  // layouts (4-4-2, 5-3-2, 5-4-1, 5-4-2) against both product_ndc and
  // package_ndc, since scanned barcodes and hand-typed codes rarely come
  // pre-formatted with the right dashes.
  // ==================================================================
  function ndcCandidates(raw) {
    const digits = raw.replace(/\D/g, "");
    const out = new Set();
    if (raw.includes("-")) out.add(raw);

    const layouts = digits.length === 11
      ? [[4, 4, 2], [5, 3, 2], [5, 4, 1]]
      : digits.length === 10
      ? [[4, 4, 1], [5, 3, 1], [5, 4]]
      : [];

    for (const layout of layouts) {
      const parts = [];
      let pos = 0;
      for (const len of layout) {
        parts.push(digits.slice(pos, pos + len));
        pos += len;
      }
      out.add(parts.join("-"));
    }
    if (digits.length >= 10) out.add(digits);
    return Array.from(out);
  }

  async function getByNDC(raw) {
    const candidates = ndcCandidates(raw);
    for (const candidate of candidates) {
      for (const field of ["product_ndc", "package_ndc"]) {
        try {
          const url =
            `${OPENFDA_BASE}/drug/ndc.json?search=${field}:"${candidate}"` +
            `&limit=1&api_key=${OPENFDA_API_KEY}`;
          const data = await safeJson(url);
          const result = data?.results?.[0];
          if (result) {
            const med = normalizeNdcResult(result);
            try {
              const image = await getBestImage(med.name, med.splId);
              if (image) med.image = image;
            } catch (_) {
              // image enrichment is best-effort — never block the result on it
            }
            return med;
          }
        } catch (_) {
          // try next candidate/field
        }
      }
    }
    return null;
  }

  // ==================================================================
  // Barcode → NDC. Most US pharmacy/retail drug packaging encodes the
  // NDC (sometimes prefixed with "3" for the FDA's GS1 item indicator,
  // sometimes as an 11 or 12-digit UPC-A with a leading 0) directly in
  // the barcode. This tries the scanned digit string, then the same
  // string with a leading digit stripped, against the NDC Directory.
  //
  // IMPORTANT HONEST CAVEAT: this only works for products whose barcode
  // actually is (or encodes) an NDC — true for the large majority of US
  // pharmacy medicines, but NOT for every consumer product. There is no
  // free, universal "any barcode -> any product" database; if you want
  // that (e.g. to also resolve random supplements/foreign products),
  // you'd need a paid barcode-lookup API — see the note at the bottom
  // of this file for what to sign up for if you want that.
  // ==================================================================
  async function getByBarcode(rawCode) {
    const digits = rawCode.replace(/\D/g, "");
    const attempts = new Set([digits]);
    if (digits.length === 12) attempts.add(digits.slice(1)); // strip UPC-A leading 0
    if (digits.length === 13) attempts.add(digits.slice(2)); // strip EAN-13 padding
    attempts.add(digits.replace(/^0+/, ""));

    for (const attempt of attempts) {
      if (attempt.length < 10) continue;
      const result = await getByNDC(attempt);
      if (result) return result;
    }
    return null;
  }

  // ==================================================================
  // RxCUI lookup — RxNorm's canonical drug identifier.
  // ==================================================================
  async function getByRxcui(rxcui) {
    try {
      const url = `${RXNORM_BASE}/rxcui/${encodeURIComponent(rxcui)}/property.json?propName=RxNorm%20Name`;
      const data = await safeJson(url);
      const name = data?.propConceptGroup?.propConcept?.[0]?.propValue;
      if (!name) return null;
      return getDetails(name, { rxcui });
    } catch (err) {
      console.warn("RxCUI lookup failed:", err);
      return null;
    }
  }

  // ==================================================================
  // RxClass: ATC classification for a given RxCUI.
  // ==================================================================
  async function getATCForRxcui(rxcui) {
    if (!rxcui) return [];
    return cached(`atc:${rxcui}`, async () => {
      try {
        const url = `${RXCLASS_BASE}/class/byRxcui.json?rxcui=${encodeURIComponent(rxcui)}&relaSource=ATC`;
        const data = await safeJson(url);
        const items = data?.rxclassDrugInfoList?.rxclassDrugInfo || [];
        return items
          .map((i) => i.rxclassMinConceptItem)
          .filter(Boolean)
          .map((c) => ({ code: c.classId, name: c.className }));
      } catch (err) {
        console.warn("RxClass ATC lookup failed:", err);
        return [];
      }
    });
  }

  // Reverse: given an ATC code, find matching drug names (used when the
  // user searches directly by ATC code).
  async function getByATC(atcCode) {
    try {
      const url = `${RXCLASS_BASE}/classMembers.json?classId=${encodeURIComponent(atcCode)}&relaSource=ATC`;
      const data = await safeJson(url);
      const members = data?.drugMemberGroup?.drugMember || [];
      const names = members
        .map((m) => m.minConcept?.name)
        .filter(Boolean)
        .slice(0, 24);
      const results = [];
      for (const name of names) {
        const det = await getDetails(name);
        if (det) results.push(det);
      }
      return results;
    } catch (err) {
      console.warn("RxClass ATC member lookup failed:", err);
      return [];
    }
  }

  // ==================================================================
  // PubChem: CAS Registry Number (not exposed directly, pulled out of
  // the compound's synonym list).
  // ==================================================================
  async function getCAS(name) {
    return cached(`cas:${name.toLowerCase()}`, async () => {
      try {
        const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/synonyms/JSON`;
        const data = await safeJson(url);
        const synonyms = data?.InformationList?.Information?.[0]?.Synonym || [];
        const casPattern = /^\d{2,7}-\d{2}-\d$/;
        return synonyms.find((s) => casPattern.test(s)) || null;
      } catch (err) {
        console.warn("PubChem CAS lookup failed:", err);
        return null;
      }
    });
  }

  async function getByCAS(cas) {
    try {
      const url = `${PUBCHEM_BASE}/compound/xref/RegistryID/${encodeURIComponent(cas)}/property/IUPACName,Title/JSON`;
      const data = await safeJson(url);
      const props = data?.PropertyTable?.Properties?.[0];
      const name = props?.Title || props?.IUPACName;
      if (!name) return null;
      const det = await getDetails(name);
      if (det) return det;
      // openFDA/DailyMed may not know this exact name — return a minimal
      // PubChem-sourced record rather than nothing.
      return {
        id: slugify(name),
        name,
        generic: name,
        brand: [],
        category: "General",
        form: "—",
        strength: "—",
        description: "No FDA label found for this substance under this name — this record comes from PubChem only.",
        dosage: "See a pharmacist or the substance's safety data sheet.",
        sideEffects: [],
        warnings: "Not verified against an FDA label. Confirm identity before use.",
        cas,
        source: "PubChem",
      };
    } catch (err) {
      console.warn("PubChem CAS reverse lookup failed:", err);
      return null;
    }
  }

  // ==================================================================
  // DailyMed: real package/label photos — the primary image source.
  // Given a setid (a.k.a. spl_id), fetch that label's media list and
  // return the first actual image file's direct URL. If we only have a
  // drug name (no setid yet), look one up first via the same spls.json
  // search fetchDailyMed() already uses.
  // ==================================================================
  async function getDailyMedImageBySetId(setid) {
    if (!setid) return null;
    return cached(`dmimg-setid:${setid}`, async () => {
      try {
        const url = `${DAILYMED_BASE}/spls/${encodeURIComponent(setid)}/media.json`;
        const data = await safeJson(url);
        const media = data?.data?.media || [];
        const image = media.find((m) => (m.mime_type || "").startsWith("image/"));
        return image?.url || null;
      } catch (err) {
        console.warn("DailyMed media lookup failed:", err);
        return null;
      }
    });
  }

  async function getDailyMedImage(name) {
    return cached(`dmimg-name:${name.toLowerCase()}`, async () => {
      try {
        const dm = await fetchDailyMed(name);
        const setid = dm?.setid;
        if (!setid) return null;
        return getDailyMedImageBySetId(setid);
      } catch (err) {
        console.warn("DailyMed image-by-name lookup failed:", err);
        return null;
      }
    });
  }

  // ==================================================================
  // Wikidata: representative photo (property P18), keyless, CORS-enabled
  // via origin=*. Used as a fallback when DailyMed has no image.
  // ==================================================================
  async function getWikidataImage(name) {
    return cached(`wdimg:${name.toLowerCase()}`, async () => {
      try {
        const searchUrl =
          `${WIKIDATA_BASE}?action=wbsearchentities&search=${encodeURIComponent(name)}` +
          `&language=en&format=json&origin=*&type=item&limit=1`;
        const searchData = await safeJson(searchUrl);
        const qid = searchData?.search?.[0]?.id;
        if (!qid) return null;

        const claimsUrl = `${WIKIDATA_BASE}?action=wbgetclaims&entity=${qid}&property=P18&format=json&origin=*`;
        const claimsData = await safeJson(claimsUrl);
        const filename = claimsData?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
        if (!filename) return null;

        return COMMONS_FILE_BASE + encodeURIComponent(filename.replace(/ /g, "_"));
      } catch (err) {
        console.warn("Wikidata image lookup failed:", err);
        return null;
      }
    });
  }

  // Tries DailyMed first (real product photos), falls back to Wikidata.
  // `setid` is passed through when the caller already has one (from an
  // openFDA label's openfda.spl_id or an NDC entry's spl_id) so we can
  // skip an extra name-search round trip.
  async function getBestImage(name, setid) {
    const dmImage = setid ? await getDailyMedImageBySetId(setid) : await getDailyMedImage(name);
    if (dmImage) return dmImage;
    return getWikidataImage(name);
  }

  // ==================================================================
  // Normalizers
  // ==================================================================
  function normalizeFdaResult(label, fallbackName) {
    const info = label.openfda || {};
    const name = pick(info.brand_name) || pick(info.generic_name) || fallbackName;

    return {
      id: slugify(name),
      name,
      generic: pick(info.generic_name) || name,
      brand: info.brand_name || [],
      category: pick(info.pharm_class_epc) || pick(info.pharm_class_cs) || "General",
      form: pick(info.dosage_form) || pick(info.route) || "—",
      strength: pick(info.strength) || "See label",
      description:
        truncate(pick(label.indications_and_usage), 700) ||
        "No description available from openFDA for this entry.",
      dosage:
        truncate(pick(label.dosage_and_administration), 500) ||
        "See package insert for dosing.",
      sideEffects: (pick(label.adverse_reactions) || "")
        .split(/(?<=[.;])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 3 && s.length < 120)
        .slice(0, 6),
      warnings:
        truncate(pick(label.warnings) || pick(label.warnings_and_cautions), 600) ||
        "No warnings listed in this label.",
      rxcui: pick(info.rxcui),
      ndc: pick(info.product_ndc),
      unii: pick(info.unii),
      splId: pick(info.spl_id) || pick(info.spl_set_id),
      source: "openFDA",
    };
  }

  function normalizeNdcResult(entry) {
    const name = entry.brand_name || entry.generic_name;
    const ingredients = (entry.active_ingredients || [])
      .map((i) => `${i.name} ${i.strength || ""}`.trim())
      .join(", ");

    return {
      id: slugify(name),
      name,
      generic: entry.generic_name || name,
      brand: entry.brand_name ? [entry.brand_name] : [],
      category: pick(entry.pharm_class) || entry.product_type || "General",
      form: entry.dosage_form || "—",
      strength: ingredients || "See label",
      description: `Labeled by ${entry.labeler_name || "unknown labeler"}. Route: ${entry.route?.join(", ") || "—"}.`,
      dosage: "See package insert for dosing.",
      sideEffects: [],
      warnings: entry.dea_schedule ? `DEA Schedule ${entry.dea_schedule} controlled substance.` : "See package insert.",
      ndc: entry.product_ndc,
      rxcui: pick(entry.openfda?.rxcui),
      splId: entry.spl_id,
      source: "openFDA NDC Directory",
    };
  }

  function normalizeDailyMed(entry, fallbackName) {
    return {
      id: slugify(fallbackName),
      name: entry.title || fallbackName,
      generic: fallbackName,
      brand: [],
      category: "General",
      form: "—",
      strength: "—",
      description: "Limited structured data available — see the full DailyMed label for details.",
      dosage: "See the full DailyMed label for dosing information.",
      sideEffects: [],
      warnings: "Consult the full label before use.",
      source: "DailyMed",
    };
  }

  // ==================================================================
  // Public API
  // ==================================================================

  // Live name suggestions for the search-as-you-type box (RxNorm)
  async function search(query) {
    return suggestNames(query);
  }

  // Broad results grid for the search results page — this is the "search
  // the whole industry" entry point, not capped to any local list.
  async function searchAll(query, limit = 24) {
    return searchLabels(query, limit);
  }

  // Full detail lookup for a medicine name, tries openFDA then DailyMed,
  // then enriches with CAS/ATC/Wikidata photo where available. `extra`
  // can carry a known rxcui to skip re-deriving it.
  async function getDetails(name, extra = {}) {
    let med = null;
    const label = await fetchLabel(name);
    if (label) {
      med = normalizeFdaResult(label, name);
    } else {
      const dm = await fetchDailyMed(name);
      if (dm) med = normalizeDailyMed(dm, name);
    }
    if (!med) return null;

    med.rxcui = med.rxcui || extra.rxcui || null;

    // Enrichment is best-effort and run in parallel; any failure just
    // leaves that field blank rather than breaking the page.
    const [cas, atc, image] = await Promise.allSettled([
      getCAS(med.generic || med.name),
      med.rxcui ? getATCForRxcui(med.rxcui) : Promise.resolve([]),
      getBestImage(med.name, med.splId),
    ]);
    if (cas.status === "fulfilled" && cas.value) med.cas = cas.value;
    if (atc.status === "fulfilled" && atc.value.length) med.atc = atc.value;
    if (image.status === "fulfilled" && image.value) med.image = image.value;

    return med;
  }

  // Single entry point that inspects the query, figures out whether it's
  // a name, NDC, RxCUI, CAS number, or ATC code, and routes accordingly.
  async function lookupAny(query) {
    const { type, value } = detectIdentifier(query);
    switch (type) {
      case "ndc":
        return getByNDC(value);
      case "cas":
        return getByCAS(value);
      case "rxcui":
        return getByRxcui(value);
      case "atc": {
        const list = await getByATC(value);
        return list[0] || null;
      }
      default:
        return getDetails(value);
    }
  }

  return {
    search,
    searchAll,
    getDetails,
    lookupAny,
    detectIdentifier,
    getByNDC,
    getByBarcode,
    getByRxcui,
    getByCAS,
    getByATC,
    getATCForRxcui,
    getWikidataImage,
    getDailyMedImage,
    getBestImage,
  };
})();
