// Power Query: reemplazar el código de dim_calendario en una copia de A2.
// Rango de años completos para el dataset sintético del curso.
let
    Inicio = #date(2025, 1, 1),
    Fin = #date(2026, 12, 31),
    Dias = List.Dates(Inicio, Duration.Days(Fin - Inicio) + 1, #duration(1, 0, 0, 0)),
    Base = Table.FromList(Dias, Splitter.SplitByNothing(), {"fecha"}),
    Fecha = Table.TransformColumnTypes(Base, {{"fecha", type date}}),
    Anio = Table.AddColumn(Fecha, "anio", each Date.Year([fecha]), Int64.Type),
    Mes = Table.AddColumn(Anio, "mes", each Date.Month([fecha]), Int64.Type),
    NombreMes = Table.AddColumn(Mes, "nombre_mes", each Date.MonthName([fecha], "es-MX"), type text),
    SemanaISO = Table.AddColumn(NombreMes, "semana_iso", each
        let Jueves = Date.AddDays([fecha], 3 - Date.DayOfWeek([fecha], Day.Monday))
        in Number.IntegerDivide(Duration.Days(Jueves - #date(Date.Year(Jueves), 1, 1)), 7) + 1,
        Int64.Type),
    DiaSemana = Table.AddColumn(SemanaISO, "dia_semana", each Date.DayOfWeekName([fecha], "es-MX"), type text),
    EsHabil = Table.AddColumn(DiaSemana, "es_habil", each Date.DayOfWeek([fecha], Day.Monday) < 6, type logical),
    // Convención trimestral sintética; no representa el calendario fiscal real de una empresa.
    Periodo = Table.AddColumn(EsHabil, "periodo_fiscal", each
        Text.From([anio]) & "-" & Text.From(Date.QuarterOfYear([fecha])) & "T", type text),
    InicioMes = Table.AddColumn(Periodo, "mes_inicio", each Date.StartOfMonth([fecha]), type date),
    AnioMes = Table.AddColumn(InicioMes, "anio_mes", each Date.ToText([fecha], [Format="yyyy-MM", Culture="en-US"]), type text)
in
    AnioMes
