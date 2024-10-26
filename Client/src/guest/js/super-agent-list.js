import './index';
import '../styles/super-agent-list.css';
import halalWhatsapp from '/public/images/halal-whatsapp.png';
import { API_URL } from '../../../constants';

const api = API_URL;

document.addEventListener('DOMContentLoaded', function () {
    async function fetchSuperAgents() {
        try {
            const response = await fetch(`${api}/superagent/uplines`);
            const data = await response.json();

            if(data.statusCode === 200) {
                const uplines = data.data;
                
                uplines.forEach(upline => {
                    const superAgents = upline.superAgents;
                    const uplineId = upline.upline.fullname;
                    const totalDownLineCount = upline.downlineCount;

                    const tableBox = document.getElementById('table-box');

                    // Create header text for each upline
                    const headerTextElement = document.createElement('div');
                    headerTextElement.className = 'header';
                    headerTextElement.id = 'header-text';

                    // Create a span element to display the total downline count dynamically
                    const countElement = document.createElement('span');
                    countElement.id = 'total-subadmins';
                    countElement.textContent = totalDownLineCount;

                    // Add the header content
                    headerTextElement.innerHTML = `সাব এডমিন ${uplineId} এর অধীনে সর্বমোট সুপার এজেন্ট আছে `;
                    headerTextElement.appendChild(countElement);
                    headerTextElement.innerHTML += ` জন`;

                    // Append header to tableBox
                    tableBox.appendChild(headerTextElement);

                    // Create Table for rendering super agent data
                    const table = document.createElement('table');
                    table.className = 'super-agent-table'; // Optional: Add a class for styling

                    const thead = document.createElement('thead');
                    const tbody = document.createElement('tbody');

                    // Create table headers
                    const headerRow = document.createElement('tr');
                    const idTh = document.createElement('th');
                    const agentTh = document.createElement('th');
                    const appTh = document.createElement('th');
                    const phoneNumberTh = document.createElement('th');
                    const complainTh = document.createElement('th');

                    idTh.innerHTML = 'ID';
                    agentTh.innerHTML = 'AGENT';
                    appTh.innerHTML = 'APP';
                    phoneNumberTh.innerHTML = 'PHONE NUMBER';
                    complainTh.innerHTML = 'COMPLAIN';

                    // Append headers to the header row
                    headerRow.appendChild(idTh);
                    headerRow.appendChild(agentTh);
                    headerRow.appendChild(appTh);
                    headerRow.appendChild(phoneNumberTh);
                    headerRow.appendChild(complainTh);
                    thead.appendChild(headerRow);

                    // Loop through super agents and create rows for each
                    superAgents.forEach(superAgent => {


                        const trBody = document.createElement('tr');

                        // Create and populate table data cells
                        const idTd = document.createElement('td');
                        const agentTd = document.createElement('td');
                        const appTd = document.createElement('td');
                        const phoneNumberTd = document.createElement('td');
                        const complainTd = document.createElement('td');

                        idTd.innerHTML = superAgent.fullname;
                        agentTd.innerHTML = 'সুপার';

                        // Create WhatsApp link and icon for the App column
                        const appLink = document.createElement('a');
                        appLink.href = superAgent.app; // Assume the WhatsApp link is provided
                        const appImage = document.createElement('img');
                        appImage.src = halalWhatsapp;
                        appImage.alt = 'WhatsApp';
                        appImage.style.width = '24px';
                        appImage.style.height = '24px';
                        appLink.target = '_blank';
                        appLink.appendChild(appImage);
                        appTd.appendChild(appLink);

                        // Populate the phone number cell
                        const phoneNumberLink = document.createElement('a');
                        phoneNumberLink.href = superAgent.app;
                        phoneNumberLink.target = '_blank';
                        phoneNumberLink.innerHTML = superAgent.phone;
                        phoneNumberTd.appendChild(phoneNumberLink);

                        // Complain button with class 'complain'
                        const complainButton = document.createElement('button');
                        complainButton.className = 'complain';
                        complainButton.id = superAgent.fullname; // Use super agent ID for the button
                        complainButton.innerHTML = 'অভিযোগ';
                        complainTd.appendChild(complainButton);

                        // Append cells to the table row
                        trBody.appendChild(idTd);
                        trBody.appendChild(agentTd);
                        trBody.appendChild(appTd);
                        trBody.appendChild(phoneNumberTd);
                        trBody.appendChild(complainTd);

                        // Append the row to the table body
                        tbody.appendChild(trBody);
                    });

                    // Append thead and tbody to the table
                    table.appendChild(thead);
                    table.appendChild(tbody);

                    // Append the table to the tableBox
                    tableBox.appendChild(table);
                });
            }
        } catch (error) {
            console.error('Error fetching super-agent', error);
        }
    }

    fetchSuperAgents();
});


document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', async function (event) {
        if (event.target.classList.contains('complain')) {
            event.preventDefault();

            const clickedId = event.target.id;
            console.log(clickedId);

            try {
                const response = await fetch(`${api}/superagent/${clickedId}`);
                const result = await response.json();

                if (result.success) {
                    const subAdminData = result.data.superAgent;
                    const uplineData = result.data.subAdminUpline;
                    const siteAdminUpline = result.data.siteAdminUpline;

                    const contentDiv = document.getElementById('content');

                    // Clear the contentDiv before rendering new content
                    contentDiv.innerHTML = '';

                    // Set up the content layout using innerHTML
                    const subAdminSection = `
                        <div class="section">
                            <div class="section-title"><h1>উনি ভেল্কির একজন অনলাইন সুপার এজেন্ট নাম্বার ${subAdminData.fullname}</h1></div>
                            <table class="info-table">
                                <tr>
                                    <td>উনার সুপার এজেন্ট আইডি:</td>
                                    <td class="agent-id">${subAdminData.fullname}</td>
                                </tr>
                                <tr>
                                    <td>উনার হোয়াটসঅ্যাপ নাম্বার:</td>
                                    <td class="subadmin-whatsapp"></td>
                                </tr>
                            </table>
                        </div>
                    `;

                    const adminSection = `
                        <div class="section">
                            <div class="section-title"><h1>এই ভেল্কির অনলাইন সুপার এজেন্ট এর আপলাইনের তথ্যঃ</h1></div>
                            <p class="upline-p">উপরের অনলাইন সুপার এজেন্ট এর বিরুদ্ধে অভিযোগ করতে হলে নিচের যে কোন নাম্বার এ হোয়াটসঅ্যাপ এ মেসেজ দিলেই হবে</p>
                            <table class="info-table">
                                <tr>
                                    <td>উনার এডমিন এর এডমিন আইডি:</td>
                                    <td class="upline-name">${uplineData.fullname}</td>
                                </tr>
                                <tr>
                                    <td>উনার সাব এডমিন এর হোয়াটসঅ্যাপ নাম্বারঃ:</td>
                                    <td class="upline-whatsapp"></td>
                                </tr>
                                <tr>
                                    <td>উনার এডমিন এর এডমিন আইডিঃ</td>
                                    <td class="upline-name">${siteAdminUpline.fullname}</td>
                                </tr>
                                <tr>
                                    <td>উনার এডমিন এর হোয়াটসঅ্যাপ নাম্বারঃ</td>
                                    <td class="site-admin-upline-whatsapp"></td>
                                </tr>
                            </table>
                            <div class="highlight"><a href="/customer-service-list.html"><h1>কাস্টমার সার্ভিস এর নাম্বার গুলো পেতে এই লিঙ্ক এ ক্লিক করুন</h1></a></div>
                        </div>
                    `;

                    // Append new content to contentDiv
                    contentDiv.innerHTML = subAdminSection + adminSection;

                    // Scroll to the contentDiv
                    contentDiv.scrollIntoView({ behavior: 'smooth' });

                    // Append clickable WhatsApp icon for subAdmin
                    const wpIcon1 = document.createElement('img');
                    wpIcon1.src = halalWhatsapp;  // Assuming halalWhatsapp is a valid image URL
                    wpIcon1.alt = 'WhatsApp Icon';

                    const subAdminWhatsappCell = document.querySelector('.subadmin-whatsapp');
                    const subAdminLink = document.createElement('a');
                    subAdminLink.href = subAdminData.app;  // WhatsApp link
                    subAdminLink.target = '_blank';  // Open in a new tab
                    subAdminLink.appendChild(wpIcon1);
                    subAdminWhatsappCell.appendChild(subAdminLink);
                    subAdminWhatsappCell.innerHTML += `<br><a href="${subAdminData.app}" target="_blank">${subAdminData.phone}</a>`;

                    // Append clickable WhatsApp icon for upline
                    const wpIcon2 = document.createElement('img');
                    wpIcon2.src = halalWhatsapp;
                    wpIcon2.alt = 'WhatsApp Icon';

                    const uplineWhatsappCell = document.querySelector('.upline-whatsapp');
                    const uplineLink = document.createElement('a');
                    uplineLink.href = uplineData.whatsapp;
                    uplineLink.target = '_blank';
                    uplineLink.appendChild(wpIcon2);
                    uplineWhatsappCell.appendChild(uplineLink);
                    uplineWhatsappCell.innerHTML += `<br><a href="${uplineData.whatsapp}" target="_blank">${uplineData.phone}</a>`;

                    // Append clickable WhatsApp icon for site admin upline
                    const wpIcon3 = document.createElement('img');
                    wpIcon3.src = halalWhatsapp;
                    wpIcon3.alt = 'WhatsApp Icon';

                    const siteAdminUplineWhatsappCell = document.querySelector('.site-admin-upline-whatsapp');
                    const siteAdminUplineLink = document.createElement('a');
                    siteAdminUplineLink.href = siteAdminUpline.whatsapp;
                    siteAdminUplineLink.target = '_blank';
                    siteAdminUplineLink.appendChild(wpIcon3);
                    siteAdminUplineWhatsappCell.appendChild(siteAdminUplineLink);
                    siteAdminUplineWhatsappCell.innerHTML += `<br><a href="${siteAdminUpline.whatsapp}" target="_blank">${siteAdminUpline.phone}</a>`;

                } else {
                    console.error('Error fetching subAdmin data:', result.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    });
});
