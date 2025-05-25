# Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# .\.venv\Scripts\Activate.ps1   # PowerShell

import requests
from bs4 import BeautifulSoup
import pandas as pd
import csv

def scrape_national_parks():
    url = "https://en.wikipedia.org/wiki/List_of_the_United_States_National_Park_System_official_units"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    tables = soup.find_all("table", class_="sortable wikitable")
    table = tables[1]  # second table on the page

    rows = table.find_all("tr")[1:]  # skip header row

    national_parks_data = []

    for row in rows:
        columns = row.find_all("td")
        if len(columns) >= 2:
            park_name = columns[0].get_text(strip=True)
            park_name = park_name.replace('"', '').replace("'", '')  # Strip quotation marks
            state = columns[1].get_text(strip=True)

            national_parks_data.append((park_name, state))

    df = pd.DataFrame(national_parks_data, columns=["National Park", "State"])
    return df

if __name__ == "__main__":

    national_parks_df = scrape_national_parks()
    national_parks_df = national_parks_df.sort_values(by="National Park", ascending=True)

    output_file = r"C:\Users\benac\OneDrive\Documents\GitHub\PassportStampGenerator\national_sites.csv"

    national_parks_df["National Park"] = (
        national_parks_df["National Park"]
        .astype(str)
        .str.replace('"', '')
        .str.replace("'", '')
        .str.replace(',', '')   # Remove all commas
        .str.strip()
    )

    national_parks_df.to_csv(
        output_file,
        index=False,
        encoding="utf-8-sig"
    )
