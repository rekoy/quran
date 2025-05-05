"use client"

interface TajweedRule {
  type: string
  identifier: string
  color: string
  cssClass: string
  description: string
}

const tajweedRules: TajweedRule[] = [
  {
    type: "hamza-wasl",
    identifier: "ٱ",
    color: "#AAAAAA",
    cssClass: "ham_wasl",
    description: "Hamzat ul Wasl",
  },
  {
    type: "silent",
    identifier: "ۡ",
    color: "#AAAAAA",
    cssClass: "slnt",
    description: "Silent",
  },
  {
    type: "laam-shamsiyah",
    identifier: "ل",
    color: "#AAAAAA",
    cssClass: "slnt",
    description: "Lam Shamsiyyah",
  },
  {
    type: "madda-normal",
    identifier: "ـٓ",
    color: "#537FFF",
    cssClass: "madda_normal",
    description: "Normal Prolongation: 2 Vowels",
  },
  {
    type: "madda-permissible",
    identifier: "ـٓ",
    color: "#4050FF",
    cssClass: "madda_permissible",
    description: "Permissible Prolongation: 2, 4, 6 Vowels",
  },
  {
    type: "madda-necessary",
    identifier: "ـٓ",
    color: "#000EBC",
    cssClass: "madda_necessary",
    description: "Necessary Prolongation: 6 Vowels",
  },
  {
    type: "qalqalah",
    identifier: "ق",
    color: "#DD0008",
    cssClass: "qlq",
    description: "Qalqalah",
  },
]

export default function TajweedGuide() {
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Tajweed Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tajweedRules.map((rule) => (
          <div key={rule.type} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded"
              style={{
                backgroundColor: rule.color,
              }}
            />
            <div>
              <p className="font-arabic text-lg">{rule.identifier}</p>
              <p className="text-sm text-gray-600">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
