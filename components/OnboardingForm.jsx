"use client";

// components/OnboardingForm.jsx
//
// Pantalla de registro / datos del usuario. Segundo paso del flujo de
// entrada, con el mismo tratamiento oscuro estilo "Wrapped" que
// LandingScreen.jsx, usando únicamente la paleta oficial de ADIPA.

import { useState } from "react";

const CAREER_OPTIONS = [
  { value: "psicologia", label: "Psicología" },
  { value: "terapia-ocupacional", label: "Terapia Ocupacional" },
  { value: "trabajo-social", label: "Trabajo social" },
  { value: "educacion-pedagogia", label: "Educación y Pedagogía" },
  { value: "administracion-publica", label: "Administración pública" },
  { value: "ciencias-sociales", label: "Ciencias Sociales" },
  { value: "derecho-juridicas", label: "Derecho y/o Ciencias Jurídicas" },
  { value: "enfermeria", label: "Enfermería" },
  { value: "fonoaudiologia", label: "Fonoaudiología" },
  { value: "kinesiologia", label: "Kinesiología" },
  { value: "medicina", label: "Medicina" },
  { value: "nutricion", label: "Nutrición" },
  { value: "obstetricia-puericultura", label: "Obstetricia y Puericultura" },
  { value: "sociologia", label: "Sociología" },
  { value: "otra", label: "Otra" },
];

// Latinoamérica + España, orden alfabético, con "Otro" al final.
const COUNTRY_OPTIONS = [
  { value: "argentina", label: "Argentina" },
  { value: "bolivia", label: "Bolivia" },
  { value: "brasil", label: "Brasil" },
  { value: "chile", label: "Chile" },
  { value: "colombia", label: "Colombia" },
  { value: "costa-rica", label: "Costa Rica" },
  { value: "cuba", label: "Cuba" },
  { value: "ecuador", label: "Ecuador" },
  { value: "el-salvador", label: "El Salvador" },
  { value: "espana", label: "España" },
  { value: "guatemala", label: "Guatemala" },
  { value: "honduras", label: "Honduras" },
  { value: "mexico", label: "México" },
  { value: "nicaragua", label: "Nicaragua" },
  { value: "panama", label: "Panamá" },
  { value: "paraguay", label: "Paraguay" },
  { value: "peru", label: "Perú" },
  { value: "puerto-rico", label: "Puerto Rico" },
  { value: "republica-dominicana", label: "República Dominicana" },
  { value: "uruguay", label: "Uruguay" },
  { value: "venezuela", label: "Venezuela" },
  { value: "otro", label: "Otro" },
];

const EDUCATION_LEVELS = [
  { value: "estudiante", label: "Estudiante" },
  { value: "egresado", label: "Licenciado/a / Egresado/a" },
  { value: "titulado", label: "Titulado/a" },
  { value: "postitulo", label: "Con Postítulo / Magíster" },
];

const initialFormState = {
  fullName: "",
  email: "",
  career: "",
  otherCareer: "",
  country: "",
  otherCountry: "",
  age: "",
  educationLevel: "",
};

export default function OnboardingForm({ onComplete }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectEducationLevel = (value) => {
    setFormData((prev) => ({ ...prev, educationLevel: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      ...formData,
      career:
        formData.career === "otra"
          ? formData.otherCareer.trim()
          : CAREER_OPTIONS.find((option) => option.value === formData.career)
              ?.label ?? formData.career,
      country:
        formData.country === "otro"
          ? formData.otherCountry.trim()
          : COUNTRY_OPTIONS.find((option) => option.value === formData.country)
              ?.label ?? formData.country,
      educationLevel:
        EDUCATION_LEVELS.find((option) => option.value === formData.educationLevel)?.label ??
        formData.educationLevel,
      ageRange: formData.age,
    };

    onComplete?.(data);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary-navy p-6 text-white shadow-md sm:p-10">
      {/* Halos decorativos, estilo Wrapped */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-purple/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-primary-cyan/20 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <span className="mx-auto inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-light">
            Paso 1 de 3
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">¡Bienvenido/a a ADIPA!</h1>
          <p className="text-sm font-medium text-secondary-light/90 sm:text-base">
            Tu camino profesional empieza con un clic. Completa tu perfil para desbloquear tus
            resultados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Nombre completo" htmlFor="fullName">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Ej: María Fernanda Rojas"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
            />
          </Field>

          <Field label="Correo electrónico" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
            />
          </Field>

          <Field label="Tu profesión o área de estudio" htmlFor="career">
            <select
              id="career"
              name="career"
              required
              value={formData.career}
              onChange={handleChange("career")}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
            >
              <option className="bg-secondary-navy text-white" value="" disabled>
                Selecciona una opción
              </option>
              {CAREER_OPTIONS.map((option) => (
                <option className="bg-secondary-navy text-white" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {formData.career === "otra" && (
              <input
                id="otherCareer"
                name="otherCareer"
                type="text"
                required
                placeholder="Cuéntanos cuál"
                value={formData.otherCareer}
                onChange={handleChange("otherCareer")}
                className="mt-3 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
              />
            )}
          </Field>

          <Field label="País de residencia" htmlFor="country">
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange("country")}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
            >
              <option className="bg-secondary-navy text-white" value="" disabled>
                Selecciona tu país
              </option>
              {COUNTRY_OPTIONS.map((option) => (
                <option className="bg-secondary-navy text-white" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {formData.country === "otro" && (
              <input
                id="otherCountry"
                name="otherCountry"
                type="text"
                required
                placeholder="Cuéntanos cuál"
                value={formData.otherCountry}
                onChange={handleChange("otherCountry")}
                className="mt-3 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
              />
            )}
          </Field>

          <Field label="Tu edad" htmlFor="age">
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              inputMode="numeric"
              required
              placeholder="Escribe tu edad (ej. 25)"
              value={formData.age}
              onChange={handleChange("age")}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/30 sm:text-base"
            />
          </Field>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-semibold text-white">
              ¿En qué nivel te encuentras hoy?
            </legend>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_LEVELS.map((level) => {
                const isSelected = formData.educationLevel === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleSelectEducationLevel(level.value)}
                    aria-pressed={isSelected}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-transparent bg-gradient-to-r from-primary-purple to-primary-cyan text-white shadow-md"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-primary-cyan/60 hover:text-white"
                    }`}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>
            {/* Input oculto solo para que el formulario exija la selección */}
            <input
              type="text"
              required
              value={formData.educationLevel}
              onChange={() => {}}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
          </fieldset>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary-purple to-primary-cyan px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 sm:mx-auto sm:w-auto sm:px-10 sm:text-base"
          >
            Comenzar el quiz ➔
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-white">
        {label}
      </label>
      {children}
    </div>
  );
}
