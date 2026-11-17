import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Validate the asset exclusion list before publishing.
const excluded = [
  {
    "path": "public/cases/aidbs/shared-frame-before.webp",
    "sha256": "f1438ea8249ee43612155d67c02003766a65ae1ea3802a15357de8075313f185"
  },
  {
    "path": "public/media/cases/aidbs/shared-frame-before-640-7f8e077f43.webp",
    "sha256": "7f8e077f432c6a98583620933b9ae57cf67940787af009266612dc0ec5ba87a6"
  },
  {
    "path": "public/media/cases/aidbs/shared-frame-before-960-1b9bd991f3.webp",
    "sha256": "1b9bd991f3585b738749c9f8f9cd4a487d4b3998734e21a9b72411aaffaf7dc6"
  },
  {
    "path": "public/cases/aidbs/shared-frame-after.webp",
    "sha256": "ef47fcf30dbdefeb571efe6aff93c3055019065ac26a8d9212d71f9d343cd69d"
  },
  {
    "path": "public/media/cases/aidbs/shared-frame-after-640-1f2c193f1b.webp",
    "sha256": "1f2c193f1ba21f6d8f48e9cb6fed9d82869228600c44fb3171634a6d4e69affa"
  },
  {
    "path": "public/media/cases/aidbs/shared-frame-after-960-524b9810d4.webp",
    "sha256": "524b9810d4697806a7ffce8ae0b9722efd5ba55176902b541b663c67512c1cb6"
  },
  {
    "path": "public/cases/cloudai/dev-runtime-source.webp",
    "sha256": "42af6b397011c2e25f185890057a79ee0814a5da9178d142bb2e05b83f1ea5fd"
  },
  {
    "path": "public/media/cases/cloudai/dev-runtime-source-640-8e9e02dfbf.webp",
    "sha256": "8e9e02dfbfd977557319081e8db1a24d7ef5afc6d93bb8855e68ac8f6c4902d1"
  },
  {
    "path": "public/media/cases/cloudai/dev-runtime-source-960-28b854e308.webp",
    "sha256": "28b854e308039d8d7512c838398e0572c19c9f54deec7df8e8b3616adeecaf62"
  },
  {
    "path": "public/cases/cloudai/dev-design-io.webp",
    "sha256": "ea723de1aeac36cf0950858ee2bd92f8a706ee4ee713b9a9bcccadb958d4c873"
  },
  {
    "path": "public/media/cases/cloudai/dev-design-io-640-a79a41095a.webp",
    "sha256": "a79a41095a7cc320455b597933a46d959350af015bc27992f56d5a0b307617c4"
  },
  {
    "path": "public/media/cases/cloudai/dev-design-io-960-a10307076b.webp",
    "sha256": "a10307076b7a5c225ef6ec3968faacfb2a909b6fd9f1a90ec760dadbc8c921a2"
  },
  {
    "path": "public/cases/cloudai/runtime-structure.webp",
    "sha256": "71ce6d6e0cfb388b7cc9e08b725cf17c57b82e92255a99bb09961209cfd14fec"
  },
  {
    "path": "public/media/cases/cloudai/runtime-structure-640-682c6e621e.webp",
    "sha256": "682c6e621e3ac0e5e7e894a1f83c54cf51ce33c54521d180078cbca14387caf9"
  },
  {
    "path": "public/media/cases/cloudai/runtime-structure-960-fc392a3d03.webp",
    "sha256": "fc392a3d03efe8dd1b33545305f0bd1a0899e2eba1906b52e58a50d7a5848199"
  },
  {
    "path": "public/cases/cloudai/open-source.webp",
    "sha256": "fd4a6503f31d76882224fd40f67a536e783473ba0ca8a912f5a0bbcd65222cfb"
  },
  {
    "path": "public/media/cases/cloudai/open-source-640-fa6d1873d4.webp",
    "sha256": "fa6d1873d45be9bfcefe974d76ee9679cb0f5ef72cbc0781f9e88aaf7b0a3202"
  },
  {
    "path": "public/media/cases/cloudai/open-source-960-2ab3054076.webp",
    "sha256": "2ab3054076ebb3caa918fd30057ebab3c5f1b6ed15afb4aaabc4df4ccf6d6e39"
  },
  {
    "path": "public/cases/cloudai/component-catalog.webp",
    "sha256": "c7954e403de92cbae61201bccc2e1f65a6c6c8f46df7ae36dc47c98df31b3417"
  },
  {
    "path": "public/media/cases/cloudai/component-catalog-640-64cede6f64.webp",
    "sha256": "64cede6f6476c001dc279b0b9ac7ede65458121a43efc6249518675b03de3f7d"
  },
  {
    "path": "public/media/cases/cloudai/component-catalog-960-a9e5a7b02e.webp",
    "sha256": "a9e5a7b02e5511b18489c5450c5034ba1cf7d9424202affa27419718c53a609a"
  },
  {
    "path": "public/cases/cloudai/clarification-source.webp",
    "sha256": "8f629a79619ac26e8f92ee03f5c9bc1afab647cd127c1bbc929a1029f786a1c1"
  },
  {
    "path": "public/media/cases/cloudai/clarification-source-640-11de7832ec.webp",
    "sha256": "11de7832ec068eb36376531354fd325b6886f657bb26e3a58bf616b5d2525207"
  },
  {
    "path": "public/media/cases/cloudai/clarification-source-826-14396aea02.webp",
    "sha256": "14396aea02d23d60e3af04a4b56560e739895b7510b2b8510b711b76492a252e"
  },
  {
    "path": "public/home/work/cloudai-system.webp",
    "sha256": "f77cb2f09a3b02b63d92d5cddc9cd75636239efb296b4becdba73552d7784666"
  },
  {
    "path": "public/cases/data-agent/cover.webp",
    "sha256": "d4300eccea2e9cbfaa8ab71eebbbb75c382dca78f9ec028f3a3abd7d6454124a"
  },
  {
    "path": "public/media/cases/data-agent/cover-640-a51ee5f395.webp",
    "sha256": "a51ee5f3951a9869660842e460d494a5455db8b40c7152ac6beff60c41bd5e91"
  },
  {
    "path": "public/media/cases/data-agent/cover-960-f9fca6edc1.webp",
    "sha256": "f9fca6edc14e40ee680b10bff07c0ccb416063baaa8cc9aaa118b54a34802028"
  }
]
const deniedPaths = new Set(excluded.map(file => file.path.slice('public/'.length)))
const deniedHashes = new Set(excluded.map(file => file.sha256))
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(resolve(dir, entry.name)) : resolve(dir, entry.name)))).flat()
}
export async function checkPublicAssets(directories) {
  const failures = []
  for (const dir of directories) {
    for (const file of await files(dir)) {
      const path = relative(dir, file).replaceAll('\\', '/')
      if (deniedPaths.has(path) || /(?:^|\/)(?:IMG_\d+)|\.hei[cf]$/i.test(path)) {
        failures.push(path)
        continue
      }
      const hash = createHash('sha256').update(await readFile(file)).digest('hex')
      if (deniedHashes.has(hash)) failures.push(path)
    }
  }
  if (failures.length) throw new Error(`Excluded assets cannot be published:\n${[...new Set(failures)].join('\n')}`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await checkPublicAssets(process.argv.slice(2).map(dir => resolve(dir)))
  console.log('Public asset check passed')
}
