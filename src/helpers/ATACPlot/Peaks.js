// const data = [
//     { tooltip: "chr1:133131-1313133", left: "0%" },
//     { tooltip: "chr1:133131-1313133", left: "10%" },
//     { tooltip: "chr1:133131-1313133", left: "20%" },
//     { tooltip: "chr1:133131-1313133", left: "30%" },
//     { tooltip: "chr1:133131-1313133", left: "40%" },
//     { tooltip: "chr1:133131-1313133", left: "50%" }
// ];


const data = [
    {'interval': 'chr20:35085224-35176387', 'label': '+!__gene__cdc42bpab', 'start': 0.549603272630258, 'width': 0.450396727369742},
{'interval': 'chr20:35013434-35052823', 'label': '-*__gene__kif26bb', 'start': 0.19492011106390128, 'width': 0.19460391490370837},
{'interval': 'chr20:34991620-35012093', 'label': '-*__gene__cnstb', 'start': 0.08714662608815944, 'width': 0.10114818730670039},
{'interval': 'chr20:35058634-35070476', 'label': '+*__gene__hnrnpub', 'start': 0.4182336492001225, 'width': 0.058506170765688766},
{'interval': 'chr20:34973981-34985555', 'label': '-!__gene__sccpdhb', 'start': 0.0, 'width': 0.05718209934488108},
{'interval': 'chr20:35073981-35076387', 'label': '-*__mygene__lft1', 'start': 0.4940565003013745, 'width': 0.01188699939725107},
{'interval': 'chr20:34975720-34976221', 'label': 'atac', 'start': 0.008591642540240902, 'width': 0.002475223066509886},
{'interval': 'chr20:34977927-34978428', 'label': 'atac', 'start': 0.019495469501892237, 'width': 0.002475223066509886},
{'interval': 'chr20:34981737-34982238', 'label': 'atac', 'start': 0.03831902216337461, 'width': 0.002475223066509886},
{'interval': 'chr20:34983518-34984019', 'label': 'atac', 'start': 0.047118168433742086, 'width': 0.002475223066509886},
{'interval': 'chr20:34985058-34985559', 'label': 'atac', 'start': 0.05472663853838325, 'width': 0.002475223066509886},
{'interval': 'chr20:34993912-34994413', 'label': 'atac', 'start': 0.09847040107506694, 'width': 0.002475223066509886},
{'interval': 'chr20:34997695-34998196', 'label': 'atac', 'start': 0.11716055848146795, 'width': 0.002475223066509886},
{'interval': 'chr20:34999657-35000158', 'label': 'atac', 'start': 0.1268539470173809, 'width': 0.002475223066509886},
{'interval': 'chr20:35002212-35002713', 'label': 'atac', 'start': 0.13947709060008104, 'width': 0.002475223066509886},
{'interval': 'chr20:35004077-35004578', 'label': 'atac', 'start': 0.14869124433070166, 'width': 0.002475223066509886},
{'interval': 'chr20:35005144-35005645', 'label': 'atac', 'start': 0.15396282718891732, 'width': 0.002475223066509886},
{'interval': 'chr20:35007199-35007700', 'label': 'atac', 'start': 0.16411568827011058, 'width': 0.002475223066509886},
{'interval': 'chr20:35008849-35009350', 'label': 'atac', 'start': 0.17226762052508324, 'width': 0.002475223066509886},
{'interval': 'chr20:35009373-35009874', 'label': 'atac', 'start': 0.17485647658666245, 'width': 0.002475223066509886},
{'interval': 'chr20:35010573-35011074', 'label': 'atac', 'start': 0.18078515459027894, 'width': 0.002475223066509886},
{'interval': 'chr20:35011122-35011623', 'label': 'atac', 'start': 0.18349752477693348, 'width': 0.002475223066509886},
{'interval': 'chr20:35011787-35012288', 'label': 'atac', 'start': 0.18678300050393762, 'width': 0.002475223066509886},
{'interval': 'chr20:35012309-35012810', 'label': 'atac', 'start': 0.1893619754355108, 'width': 0.002475223066509886},
{'interval': 'chr20:35012945-35013446', 'label': 'atac', 'start': 0.19250417477742754, 'width': 0.002475223066509886},
{'interval': 'chr20:35014338-35014839', 'label': 'atac', 'start': 0.19938638182662569, 'width': 0.002475223066509886},
{'interval': 'chr20:35015284-35015785', 'label': 'atac', 'start': 0.2040601563194767, 'width': 0.002475223066509886},
{'interval': 'chr20:35017386-35017887', 'label': 'atac', 'start': 0.2144452239558116, 'width': 0.002475223066509886},
{'interval': 'chr20:35021400-35021901', 'label': 'atac', 'start': 0.23427665187790875, 'width': 0.002475223066509886},
{'interval': 'chr20:35024026-35024527', 'label': 'atac', 'start': 0.24725057557582286, 'width': 0.002475223066509886},
{'interval': 'chr20:35024605-35025106', 'label': 'atac', 'start': 0.25011116271256784, 'width': 0.002475223066509886},
{'interval': 'chr20:35030289-35030790', 'label': 'atac', 'start': 0.27819333418969794, 'width': 0.002475223066509886},
{'interval': 'chr20:35043833-35044334', 'label': 'atac', 'start': 0.3451083465905161, 'width': 0.002475223066509886},
{'interval': 'chr20:35049003-35049504', 'label': 'atac', 'start': 0.3706510676560972, 'width': 0.002475223066509886},
{'interval': 'chr20:35051378-35051879', 'label': 'atac', 'start': 0.38238490953825477, 'width': 0.002475223066509886},
{'interval': 'chr20:35051934-35052435', 'label': 'atac', 'start': 0.38513186367993046, 'width': 0.002475223066509886},
{'interval': 'chr20:35052668-35053169', 'label': 'atac', 'start': 0.3887582383921425, 'width': 0.002475223066509886},
{'interval': 'chr20:35055051-35055552', 'label': 'atac', 'start': 0.40053160479432426, 'width': 0.002475223066509886},
{'interval': 'chr20:35056096-35056597', 'label': 'atac', 'start': 0.40569449522247364, 'width': 0.002475223066509886},
{'interval': 'chr20:35057113-35057614', 'label': 'atac', 'start': 0.41071904983053864, 'width': 0.002475223066509886},
{'interval': 'chr20:35058389-35058890', 'label': 'atac', 'start': 0.41702321077438415, 'width': 0.002475223066509886},
{'interval': 'chr20:35059074-35059575', 'label': 'atac', 'start': 0.4204074978014486, 'width': 0.002475223066509886},
{'interval': 'chr20:35059688-35060189', 'label': 'atac', 'start': 0.423441004713299, 'width': 0.002475223066509886},
{'interval': 'chr20:35060286-35060787', 'label': 'atac', 'start': 0.42639546258510125, 'width': 0.002475223066509886},
{'interval': 'chr20:35061113-35061614', 'label': 'atac', 'start': 0.4304813098425936, 'width': 0.002475223066509886},
{'interval': 'chr20:35062508-35063009', 'label': 'atac', 'start': 0.43737339802179775, 'width': 0.002475223066509886},
{'interval': 'chr20:35063540-35064041', 'label': 'atac', 'start': 0.44247206110490794, 'width': 0.002475223066509886},
{'interval': 'chr20:35064138-35064639', 'label': 'atac', 'start': 0.44542651897671015, 'width': 0.002475223066509886},
{'interval': 'chr20:35064782-35065283', 'label': 'atac', 'start': 0.44860824283865103, 'width': 0.002475223066509886},
{'interval': 'chr20:35065289-35065790', 'label': 'atac', 'start': 0.451113109295179, 'width': 0.002475223066509886},
{'interval': 'chr20:35066677-35067178', 'label': 'atac', 'start': 0.4579706135193621, 'width': 0.002475223066509886},
{'interval': 'chr20:35067829-35068330', 'label': 'atac', 'start': 0.46366214440283393, 'width': 0.002475223066509886},
{'interval': 'chr20:35069807-35070308', 'label': 'atac', 'start': 0.4734345819787951, 'width': 0.002475223066509886},
{'interval': 'chr20:35070358-35070859', 'label': 'atac', 'start': 0.47615683329545566, 'width': 0.002475223066509886},
{'interval': 'chr20:35070878-35071379', 'label': 'atac', 'start': 0.47872592709702283, 'width': 0.002475223066509886},
{'interval': 'chr20:35072251-35072752', 'label': 'atac', 'start': 0.48550932284616066, 'width': 0.002475223066509886},
{'interval': 'chr20:35072775-35073276', 'label': 'atac', 'start': 0.4880981789077399, 'width': 0.002475223066509886},
{'interval': 'chr20:35073654-35074155', 'label': 'atac', 'start': 0.492440935545389, 'width': 0.002475223066509886},
{'interval': 'chr20:35074189-35074690', 'label': 'atac', 'start': 0.49508413782200134, 'width': 0.002475223066509886},
{'interval': 'chr20:35075276-35075777', 'label': 'atac', 'start': 0.5004545319802772, 'width': 0.002475223066509886},
{'interval': 'chr20:35076178-35076679', 'label': 'atac', 'start': 0.5049109216129957, 'width': 0.002475223066509886},
{'interval': 'chr20:35077995-35078496', 'label': 'atac', 'start': 0.5138879282234716, 'width': 0.002475223066509886},
{'interval': 'chr20:35078666-35079167', 'label': 'atac', 'start': 0.5172030473404938, 'width': 0.002475223066509886},
{'interval': 'chr20:35082535-35083036', 'label': 'atac', 'start': 0.5363180933371541, 'width': 0.002475223066509886},
{'interval': 'chr20:35083957-35084458', 'label': 'atac', 'start': 0.5433435767714396, 'width': 0.002475223066509886},
{'interval': 'chr20:35084949-35085450', 'label': 'atac', 'start': 0.5482446172544292, 'width': 0.002475223066509886},
{'interval': 'chr20:35085741-35086242', 'label': 'atac', 'start': 0.5521575447368161, 'width': 0.002475223066509886},
{'interval': 'chr20:35086756-35087257', 'label': 'atac', 'start': 0.5571722182148751, 'width': 0.002475223066509886},
{'interval': 'chr20:35087547-35088048', 'label': 'atac', 'start': 0.561080205132259, 'width': 0.002475223066509886},
{'interval': 'chr20:35089692-35090193', 'label': 'atac', 'start': 0.5716777170637234, 'width': 0.002475223066509886},
{'interval': 'chr20:35090721-35091222', 'label': 'atac', 'start': 0.5767615584518245, 'width': 0.002475223066509886},
{'interval': 'chr20:35091575-35092076', 'label': 'atac', 'start': 0.5809808009643983, 'width': 0.002475223066509886},
{'interval': 'chr20:35094259-35094760', 'label': 'atac', 'start': 0.5942412774324872, 'width': 0.002475223066509886},
{'interval': 'chr20:35097513-35098014', 'label': 'atac', 'start': 0.6103178759522939, 'width': 0.002475223066509886},
{'interval': 'chr20:35100368-35100869', 'label': 'atac', 'start': 0.6244231890358981, 'width': 0.002475223066509886},
{'interval': 'chr20:35101211-35101712', 'label': 'atac', 'start': 0.6285880853334387, 'width': 0.002475223066509886},
{'interval': 'chr20:35104822-35105323', 'label': 'atac', 'start': 0.6464284655593213, 'width': 0.002475223066509886},
{'interval': 'chr20:35109376-35109877', 'label': 'atac', 'start': 0.668927798583046, 'width': 0.002475223066509886},
{'interval': 'chr20:35115382-35115883', 'label': 'atac', 'start': 0.6986008319911465, 'width': 0.002475223066509886},
{'interval': 'chr20:35119574-35120075', 'label': 'atac', 'start': 0.7193116804837801, 'width': 0.002475223066509886},
{'interval': 'chr20:35124004-35124505', 'label': 'atac', 'start': 0.741198383447131, 'width': 0.002475223066509886},
{'interval': 'chr20:35126495-35126996', 'label': 'atac', 'start': 0.7535053308696382, 'width': 0.002475223066509886},
{'interval': 'chr20:35129346-35129847', 'label': 'atac', 'start': 0.7675908816932304, 'width': 0.002475223066509886},
{'interval': 'chr20:35132424-35132925', 'label': 'atac', 'start': 0.7827979407725068, 'width': 0.002475223066509886},
{'interval': 'chr20:35136268-35136769', 'label': 'atac', 'start': 0.8017894726440916, 'width': 0.002475223066509886},
{'interval': 'chr20:35138227-35138728', 'label': 'atac', 'start': 0.8114680394849955, 'width': 0.002475223066509886},
{'interval': 'chr20:35147531-35148032', 'label': 'atac', 'start': 0.8574350562730354, 'width': 0.002475223066509886},
{'interval': 'chr20:35149453-35149954', 'label': 'atac', 'start': 0.8669308222088278, 'width': 0.002475223066509886},
{'interval': 'chr20:35151911-35152412', 'label': 'atac', 'start': 0.8790747309862356, 'width': 0.002475223066509886},
{'interval': 'chr20:35152651-35153152', 'label': 'atac', 'start': 0.8827307490884657, 'width': 0.002475223066509886},
{'interval': 'chr20:35155342-35155843', 'label': 'atac', 'start': 0.8960258095115757, 'width': 0.002475223066509886},
{'interval': 'chr20:35156261-35156762', 'label': 'atac', 'start': 0.9005661887493454, 'width': 0.002475223066509886},
{'interval': 'chr20:35161797-35162298', 'label': 'atac', 'start': 0.9279171566060295, 'width': 0.002475223066509886},
{'interval': 'chr20:35169724-35170225', 'label': 'atac', 'start': 0.9670810153849194, 'width': 0.002475223066509886},
{'interval': 'chr20:35173395-35173896', 'label': 'atac', 'start': 0.9852178295109829, 'width': 0.002475223066509886},
{'interval': 'chr20:35175555-35176056', 'label': 'atac', 'start': 0.9958894499174926, 'width': 0.002475223066509886},
{'interval': 'chr20:35085741-35086242', 'label': 'atac', 'start': 0.9711684370257967, 'width': 0.022360082120860485},
    ];


// Function to add boxes to the line container
export function addBoxes() {
    console.log("addBoxes function called");
    const lineContainer = document.getElementById('line-container');
    if (lineContainer) {
        console.log("line-container found");
        let zIndex = 1; // Initialize zIndex

        data.forEach(item => {
            const atacPeak = document.createElement('div');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';

            if (item.label == "atac") { //// if atac
                atacPeak.className = 'atac-peaks';
                tooltip.textContent = item.interval;
                atacPeak.style.zIndex = zIndex; // Set the zIndex for each atacPeak
                zIndex++; // Increment zIndex for the next atacPeak
                atacPeak.addEventListener('mouseout', () => {
                    atacPeak.style.zIndex = 1;
                });

            } else { ///// if gene

                //// check gene strand
                atacPeak.addEventListener('mouseout', () => {
                    atacPeak.style.zIndex = 96;
                });
                let isLeft = item.label[0] == "-";
                
                //// check if mygene or not
                let mygene = item.label.split('__')[1] == "mygene";

                console.log(item.label)
                console.log(item.label.split('__')[1])
                console.log("isleft", isLeft)
                console.log("mygene", mygene)

                if (mygene) {
                    if (isLeft) {
                        atacPeak.className = 'gene-left';
                    } else {
                        atacPeak.className = 'gene';
                    }
                } else {
                    if (isLeft) {
                        atacPeak.className = 'gene-left-border';
                    } else {
                        atacPeak.className = 'gene-border';
                    }
                }

                let gene = item.label.split('__').pop()
                tooltip.textContent = gene;
            }

            atacPeak.addEventListener('mouseover', () => {
                atacPeak.style.zIndex = 99;
            });
            
            
            atacPeak.style.left = item.start * 100 + "%";
            atacPeak.style.width = item.width * 100 + "%";

            // Append the tooltip to the atacPeak
            atacPeak.appendChild(tooltip);

            lineContainer.appendChild(atacPeak);
            console.log(`Added box with tooltip ${item.tooltip}`);
        });
    } else {
        console.log("line-container not found");
    }
}
