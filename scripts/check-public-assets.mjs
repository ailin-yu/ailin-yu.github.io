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
  },
  {
    "path": "public/cases/aidbs/query-distribution-source.webp",
    "sha256": "d025be2e8ba1201b069683a9feffa141cd9107149809a2a05f37cd6d5037f8d2"
  },
  {
    "path": "public/media/cases/aidbs/query-distribution-source-640-55e95f6bf4.webp",
    "sha256": "55e95f6bf4f70b9d060e4066f23ce7a8f1f3cbc8c7ea054f1d702b24ca50e7ff"
  },
  {
    "path": "public/media/cases/aidbs/query-distribution-source-960-5f3e6b8dd8.webp",
    "sha256": "5f3e6b8dd84d90ebb097cbf7f648efd6225afd1173dbf283df59aa3c39ed6e49"
  },
  {
    "path": "public/cases/aidbs/query-ranking-source.webp",
    "sha256": "7698fc426624071b2aea6b258bb36bdcd8291d245412aabaa01681dea18dbf1c"
  },
  {
    "path": "public/media/cases/aidbs/query-ranking-source-640-7e21408209.webp",
    "sha256": "7e21408209820f38f84d0065d84d35872325811bb143c762e8f783a99f2f599d"
  },
  {
    "path": "public/media/cases/aidbs/query-ranking-source-960-ad7c80d5b6.webp",
    "sha256": "ad7c80d5b6faac771b32800150c7925364184ee689d859ea3e010cee3e80e85f"
  },
  {
    "path": "public/cases/data-agent/report.webp",
    "sha256": "82e82454da731202b516983b2f9973a0e75367da14ab156161a4c6d6fa661d34"
  },
  {
    "path": "public/media/cases/data-agent/report-640-d25272552b.webp",
    "sha256": "d25272552b5008cbff11fde7385a42f250172e99f033ba7311e640a7e5348802"
  },
  {
    "path": "public/media/cases/data-agent/report-960-7f210cb6a3.webp",
    "sha256": "7f210cb6a3adf1f77d0d2d02da1c97b9c3053bce5e55ca02344e291e15c1efbd"
  },
  {
    "path": "public/cases/aidbs/query-demo.mp4",
    "sha256": "52d1583610b3196c67fec11659111eaa164e69a6b0b5c0e73de3b9cded283c8a"
  },
  {
    "path": "public/cases/aidbs/resource-options.webp",
    "sha256": "54d4463339eb61d9cc4241a003f8e70b035fcaa76299336f11e237050677c37e"
  },
  {
    "path": "public/media/cases/aidbs/resource-options-640-fbb014935a.webp",
    "sha256": "fbb014935ab0a709b939d00c28f5e33acec72a3ae8f5d60f877148cdefea3560"
  },
  {
    "path": "public/media/cases/aidbs/resource-options-960-20c334df59.webp",
    "sha256": "20c334df5990c507fddb8a93c0aac059959b7be22981604631727cf8e5154ba1"
  },
  {
    "path": "public/cases/aidbs/query-clarification-2x.mp4",
    "sha256": "739bc3fcd3e27d6371bf435a925b03425f68efdb573d1846771b4357de4507f3"
  },
  {
    "path": "public/cases/aidbs/query-clarification-still.webp",
    "sha256": "7dd6db06feaa6d5916b119284356e602aab01a7a4efef2e5f24ea7dca4b861ac"
  },
  {
    "path": "public/cases/aidbs/resource-options-still.webp",
    "sha256": "4dffc25fe010b4a3532b52161112bb44cf7456e242a859c0d2584c34886aa616"
  },
  {
    "path": "public/cases/aidbs/resource-options.mp4",
    "sha256": "ee79209e22090a7adf7f31899c83a617360a3b1a7485bb7fe27a3df0149b3d29"
  },
  {
    "path": "public/media/cases/aidbs/query-clarification-still-640-e5baa71cf8.webp",
    "sha256": "e5baa71cf8b24611576d2c29e2e0e91f8c62164c86d3b6dcb9bc756aec236140"
  },
  {
    "path": "public/media/cases/aidbs/query-clarification-still-960-82cc8f6ebb.webp",
    "sha256": "82cc8f6ebb09596958977976b1aa0a2880588dbeb39f445f09369ea2e02cb5e9"
  },
  {
    "path": "public/media/cases/aidbs/resource-options-still-640-401a6c612e.webp",
    "sha256": "401a6c612eadc1e5efe31cf83635f6baaac0a02465408a7c6dfe9bc5e67721d9"
  },
  {
    "path": "public/media/cases/aidbs/resource-options-still-960-9e0deafb63.webp",
    "sha256": "9e0deafb6333da2e1f1b6f5f4b77d4c3b26d766158ac68301049efe47fb8a916"
  },
  {
    "path": "public/cases/data-agent/data-import.mp4",
    "sha256": "dc7408037875b38a50427c8f195ced93b2075585dae237c96dc45068c4d4cbca"
  },
  {
    "path": "public/cases/cloudai/genui-before-cropped.svg",
    "sha256": "2ac41bdbce08093d51d05757490e4ea71679b7e1072acadb9c919ec8454d571f"
  },
  {
    "path": "public/media/cases/cloudai/genui-before-cropped-640-5524d00fe9.webp",
    "sha256": "5524d00fe9571e27db87e2d0ac0c6388fc5e625fd4089e6c26d88da294e4c5dc"
  },
  {
    "path": "public/media/cases/cloudai/genui-before-cropped-960-31ba1bc6d2.webp",
    "sha256": "31ba1bc6d205d8517c779cf8e3f2c85263ff5beffa637b5fdd9792ace389d05e"
  },
  {
    "path": "public/cases/cloudai/genui-after.webp",
    "sha256": "af2c4a8cbd2b0307ecd8eac73b9ea742e1318fbb5f79863125a9fbcee8cdb6b4"
  },
  {
    "path": "public/media/cases/cloudai/genui-after-640-d8c96be5e4.webp",
    "sha256": "d8c96be5e4347bf6cd70302bf1529934d633983760bad4cf559607df77cc634c"
  },
  {
    "path": "public/media/cases/cloudai/genui-after-960-87817b2ca4.webp",
    "sha256": "87817b2ca41872f90b172d17d0df57477cfd0a895a125d3a40c7503a8d3b272e"
  },
  {
    "path": "public/cases/data-agent/data-import-poster.webp",
    "sha256": "86186f7736ff349d350751fbc96e77aabd53df4b618ea84d4afbf5919a63dbfb"
  },
  {
    "path": "public/media/cases/data-agent/data-import-poster-640-0af0a9f48a.webp",
    "sha256": "0af0a9f48a21890d8f51ef9db71705d557c3a9b7fc13a0087456481518761500"
  },
  {
    "path": "public/media/cases/data-agent/data-import-poster-960-5d8c2da1b6.webp",
    "sha256": "5d8c2da1b6cdea2f940834d1275237c522b92c89867393fac7d406ba45fc0b8a"
  },
  {
    "path": "public/cases/data-agent/data-import-still.webp",
    "sha256": "2dbf08ba82db60f6048ee86ceb7e120fe9f966366b42d84a08638d8a028ad4c5"
  },
  {
    "path": "public/media/cases/data-agent/data-import-still-640-ad4ede49ac.webp",
    "sha256": "ad4ede49acf578c462eb94ffa2ce34881db539d01c83733c17ef6680feeec078"
  },
  {
    "path": "public/media/cases/data-agent/data-import-still-960-ec3ccec197.webp",
    "sha256": "ec3ccec197097b8a57074a2f96fbfec2a9f02c4a465b4c092ecdef3b8d4909f1"
  },
  {
    "path": "public/cases/aidbs/diagnosis-v2.webp",
    "sha256": "5cf26fa42d41ac9c5d7da2a5fc0be2fc9c0e8175480396d6fe1edf3ed805fa15"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-640-40584e1574.webp",
    "sha256": "40584e1574d8e9006a1d6a9acec127cbf8df7d4221406b673252fd69513b9bcc"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-960-8a28e1ba75.webp",
    "sha256": "8a28e1ba75f8a4423ee5e0b83eea33edce9861201131f7508d34bb015ab3260b"
  },
  {
    "path": "public/cases/aidbs/diagnosis-v2-summary.webp",
    "sha256": "dd91b1f753636ec665d161e90ba160932505792b315e6b756644e787fff415cb"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-summary-640-2f9ed869b0.webp",
    "sha256": "2f9ed869b008a05f0bd1567a48991fa7844cacff91894167d40a7e94b3e48276"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-summary-800-55b91e0d3b.webp",
    "sha256": "55b91e0d3b6ec4641958af1ef83faf4994f7a1d6171bfd01cc0edc2c76b268fc"
  },
  {
    "path": "public/cases/aidbs/diagnosis-v2-action.webp",
    "sha256": "f684303d4451ce0c336fb26b9b0a0a4319c45d84c077b35e3f310f79c50e8f23"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-action-640-52a5d20349.webp",
    "sha256": "52a5d20349a75518d7602cd83e81ff208423380283f058a83afce8a42e0df466"
  },
  {
    "path": "public/media/cases/aidbs/diagnosis-v2-action-800-299d3eb9de.webp",
    "sha256": "299d3eb9de750a2a14ffcefd184f20f711b05acbca15868bc8fdd25071c2be3b"
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
