# Easy Content Update Guide (No Coding Needed)

This website reads content directly from the JSON files in this `data/` folder.
After editing and saving a file, refresh the website page.

## Rules to avoid mistakes

1. Only change text inside quotes `"..."`.
2. Do **not** remove commas, brackets (`[]`) or braces (`{}`).
3. Keep the same structure (`label` and `value`) in `rows` lists.
4. If you add a new row, copy an existing row and edit the text.

---

## 1) Registration links

File: `config.json`

- `registrationUrl` = Register button link
- `brochureUrl` = brochure PDF path/link

---

## 2) Registration last date + important dates

File: `dates.json`

- `lastRegistrationDate` updates the highlighted date text.
- `rows` updates the “Important Dates” table.

Each row has:
- `label` = left column
- `value` = right column

---

## 3) Registration fee table

File: `fees.json`

Update `rows` entries:
- `label` = fee category
- `value` = amount/details

---

## 4) Bank details table

File: `bank.json`

Update `rows` entries:
- `label` = field name (Account Name, IFSC, etc.)
- `value` = field value

---

## 5) Contact page

File: `contacts.json`

- `organizers` controls contact cards.
- `venue` controls venue name, address, email, and map embed URL.

---

## 6) Committee page

Files:
- `committee_international.json`
- `committee_national.json`
- `committee_organizing.json`

Edit member names/institutions directly in these files.

---

## 7) Gallery on home page

File: `gallery.json`

- `year` = heading year
- `initialVisible` = number shown before “Show More”
- `images` = image file names
- `basePath` = folder path for gallery images

---

If you want, this can be reduced to **one single JSON file** for all editable text in the whole site.