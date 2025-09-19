# WorldMap Astro Component

An interactive world map component for Astro with search functionality, configurable data views, and customizable modal content.

## Features

- **Interactive SVG World Map** with pan and zoom
- **Country Search** with keyboard navigation
- **Configurable Data Views** with tabs
- **Customizable Modal Content** with Astro slots

## Installation

```bash
npm install worldmap
```

## Basic Usage

```astro
---
import WorldMap from 'worldmap';

const countryData = {
  'US': { population: 331000000, gdp: 21400000 },
  'CA': { population: 38000000, gdp: 1740000 }
};
---

<WorldMap 
  countryDetails={countryData}
  mode="modal"
/>
```

## Modal Content Customization

### Using Astro Slots

You can provide custom modal content using Astro's slot feature with data attributes:

```astro
---
import WorldMap from 'worldmap';

const countryData = {
  'BR': {
    country: 'Brazil',
    access_rank: 88,
    access_desc: 'Minimal Access Restrictions',
    needs_range_desc: 'more than ten million',
    pop_total: 217637000,
    pop_christian: 196608000,
    pct_christian: '90.34%',
    lang_total: 164,
    lang_full_bible: 36,
    lang_nt: 60,
    lang_portion: 25,
    lang_none: 43,
    bible_prio1: 'Print',
    bible_prio2: 'Audio',
    religion_main: 'Christianity',
    region: 'Latin America',
    church_growth: '0.3%'
  }
};
---

### Data Attributes

The slot content supports data attributes for dynamic content with automatic hiding of missing data:

**Basic Usage:**
- `data-fill="isoCode"` - Country ISO code (e.g., "US", "BR")
- `data-fill="countryName"` - Country display name
- `data-fill="countryData.fieldName"` - Any field from country data

**With Formatting:**
- `data-fill="countryData.population" data-format="number"` - Format numbers with commas

**Auto-Hide Behavior:**
- Elements with `data-fill` are automatically hidden if the data doesn't exist
- Grid items (elements with `col-span-*` classes) are hidden if all their data elements are missing
- This creates a clean, adaptive layout that only shows relevant information
- Modal content is automatically cleared between different country selections to prevent accumulation
- The original slot template is preserved and reused for each modal opening

**Example:**
```html
<!-- This entire grid item will be hidden if population data is missing -->
<div class="col-span-3 bg-emerald-50 rounded-xl p-5">
  <h3>Population Stats</h3>
  <span data-fill="countryData.population" data-format="number">0</span>
  <span data-fill="countryData.pop_christian" data-format="number">0</span>
</div>

<!-- Individual elements hide independently -->
<p>
  Country: <span data-fill="countryName">Unknown</span>
  <!-- This span will be hidden if gdp data is missing -->
  GDP: <span data-fill="countryData.gdp" data-format="number">N/A</span>
</p>
```

## Data Views Configuration

Configure multiple data views with tabs:

```astro
---
const dataViews = [
  {
    id: "access",
    label: "Access Ranking",
    fields: { primary: "access_rank" },
    classes: { primary: "is-access-rank" }
  },
  {
    id: "needs", 
    label: "Needs Assessment",
    fields: { primary: "needs_rank" },
    classes: { primary: "is-needs-rank" }
  },
  {
    id: "combined",
    label: "Access & Needs",
    fields: { primary: "access_rank", secondary: "needs_rank" },
    classes: { primary: "is-access-rank", secondary: "is-needs-rank" }
  }
];
---

<WorldMap 
  countryDetails={countryData}
  dataViews={dataViews}
  defaultView="access"
  mode="modal"
>
  <!-- Add your custom modal content here using slot -->
</WorldMap>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `countryDetails` | `Record<string, object>` | `{}` | Country data indexed by ISO code |
| `mode` | `"link" \| "modal"` | `"link"` | Interaction mode for countries |
| `dataViews` | `DataView[]` | `[]` | Tab configuration for data views |
| `defaultView` | `string` | `undefined` | Default active data view |
| `countryNames` | `Record<string, string>` | Default names | Custom country name mappings |
| `linkPath` | `string` | `""` | Base path for link mode |
| `classes` | `object` | `{}` | Custom CSS classes |

## Styling

The component uses Tailwind CSS classes. You can customize the appearance by providing custom classes:

```astro
<WorldMap 
  classes={{
    worldMap: "custom-map-class",
    modal: {
      overlay: "custom-overlay",
      modal: "custom-modal-panel"
    },
    search: {
      searchButton: "custom-search-btn"
    }
  }}
/>
```

## Browser Support
- Modern browsers with ES6+ support
- SVG support required
- CSS Grid support recommended for modal layouts